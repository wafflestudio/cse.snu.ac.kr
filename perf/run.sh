#!/usr/bin/env bash
# Lighthouse 수동 측정 — `pnpm perf [prod|staging|local|<url>]` (레포 루트에서).
# E2E 와 같은 핀된 Playwright 컨테이너에서 lhci 를 돌려 로컬·머신 간 Chromium 을 고정한다.
# URL 마다 PERF_RUNS(기본 3)회 돌려 중앙값 런을 대표로 삼는다(모바일·데스크톱 각각).
# perf/ 는 워크스페이스 패키지가 아니다 — lhci 는 컨테이너 안에서 npx 로 받는다(npm 캐시는 볼륨).
#
#   pnpm perf                 # prod
#   pnpm perf local           # 로컬 prod 빌드를 :PERF_PORT(기본 3000)에 띄워 잰다. /api 는 PERF_API(기본 prod)로 프록시
#   PERF_RUNS=5 pnpm perf     # 기록용은 5회(Lighthouse 문서: 5회 중앙값이 1회의 2배 안정)
#
# 결과: perf/.output/<시각>-<타깃>/{mobile,desktop}/ 에 manifest.json + HTML·JSON 리포트, summary.json.
# 두 결과 비교: node perf/compare.mjs <디렉터리A> <디렉터리B>
set -eo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

IMAGE="mcr.microsoft.com/playwright:v1.57.0-jammy" # e2e/run.sh 와 같은 태그
LHCI="@lhci/cli@0.15.1"
RUNS="${PERF_RUNS:-3}"

target="${1:-prod}"
case "$target" in
  prod) BASE="https://cse.snu.ac.kr" ;;
  staging) BASE="https://168.107.16.249.nip.io" ;;
  local) PORT="${PERF_PORT:-3000}"; BASE="http://host.docker.internal:$PORT" ;;
  http://* | https://*) BASE="$target"; target="custom" ;;
  *) echo "usage: pnpm perf [prod|staging|local|<url>]" >&2; exit 2 ;;
esac

mkdir -p perf/.output
if [ "$target" = local ]; then
  if lsof -ti :"$PORT" >/dev/null 2>&1; then
    echo "[perf] :$PORT 을 다른 프로세스가 쓰고 있다. 내리거나 PERF_PORT=<다른 포트> 로." >&2
    exit 1
  fi
  api="${PERF_API:-https://cse.snu.ac.kr}"
  echo "[perf] 로컬 prod 빌드를 :$PORT 에 띄운다 (/api → $api)"
  # build:local 과 같은 빌드인데 포트만 바꿀 수 있게 base URL 을 직접 준다(SSR 이 자기 서버의 /api 프록시를 부른다).
  VITE_API_BASE_URL="http://localhost:$PORT" pnpm --filter web exec vite build
  PORT="$PORT" METRICS_PORT=9466 API_PROXY_TARGET="$api" pnpm --filter web start >perf/.output/web.log 2>&1 &
  # pnpm → tsx → node 사슬이라 pnpm 만 죽이면 서버가 남는다. 포트를 잡은 프로세스를 직접 내린다.
  trap 'lsof -ti :"$PORT" | xargs -r kill' EXIT
  for _ in $(seq 1 30); do curl -sf -o /dev/null "http://localhost:$PORT/robots.txt" && break; sleep 1; done
  curl -sf -o /dev/null "http://localhost:$PORT/robots.txt" || { echo "[perf] 서버가 뜨지 않았다 (perf/.output/web.log)" >&2; exit 1; }
fi

out="perf/.output/$(date +%Y%m%d-%H%M%S)-$target"
mkdir -p "$out"
urls=()
while IFS= read -r p; do [ -n "$p" ] && urls+=("--url=$BASE$p"); done <perf/urls.txt
echo "[perf] $BASE — URL ${#urls[@]}개 × 모바일·데스크톱 × ${RUNS}회 → $out"

docker_args=(--rm)
[ -t 1 ] && docker_args+=(-it)

docker run "${docker_args[@]}" \
  -v "$PWD/perf":/work -w /work \
  -v csereal-perf-npm:/root/.npm \
  --add-host host.docker.internal:host-gateway \
  -e OUT="/work/${out#perf/}" -e RUNS="$RUNS" -e LHCI="$LHCI" \
  "$IMAGE" bash -c '
    set -eo pipefail
    chrome=$(ls -d /ms-playwright/chromium-*/chrome-linux*/chrome | head -1)
    for ff in mobile desktop; do
      preset=(); [ "$ff" = desktop ] && preset=(--settings.preset=desktop)
      npx --yes "$LHCI" collect --numberOfRuns="$RUNS" --chromePath="$chrome" "${preset[@]}" "$@"
      npx --yes "$LHCI" upload --target=filesystem --outputDir="$OUT/$ff"
    done
    rm -rf .lighthouseci # lhci 의 중간 산출물. upload 가 리포트를 OUT 으로 옮긴 뒤엔 필요 없다
    node summarize.mjs "$OUT"
  ' bash "${urls[@]}"
