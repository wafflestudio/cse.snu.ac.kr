#!/usr/bin/env bash
# E2E 단일 진입점 — `pnpm e2e`가 부른다(레포 루트에서)(`pnpm test` = api:test + e2e).
#   1) 백엔드 스택(db·search·backend, 소스 apps/api)을 `pnpm api:up` 으로 보장
#   2) 핀된 Playwright 컨테이너를 스택 네트워크에 붙여 API 타입 드리프트 확인 → 테스트 실행
# 컨테이너 고정 이유: 비주얼 baseline(*-linux.png)은 폰트 렌더 환경 종속 — 이 이미지가 정본.
# node_modules 는 패키지마다 볼륨을 따로 붙인다 — pnpm 워크스페이스는 루트 .pnpm 을 가리키는
# 상대 심링크를 각 패키지 아래에 만드는데, 바인드 마운트에 남기면 호스트 설치를 덮어쓴다.
# ⚠️ 볼륨 이름에 마운트 경로를 넣었다. 패키지 디렉터리를 옮기면 이름도 바꿔야 한다 — 옛 볼륨의
# 상대 심링크는 새 깊이에서 깨지는데 pnpm 은 이미 설치돼 있다고 보고 다시 링크하지 않는다.
#
# 사용:
#   pnpm e2e                        # 전체 검증(Linux baseline 대조)
#   pnpm e2e --update-snapshots     # baseline 재생성(호스트 e2e/tests/에 PNG 기록)
#   pnpm e2e tests/research/labs    # 특정 경로/프로젝트 등 인자 패스스루(e2e/ 기준 경로)
#   pnpm e2e:ui                     # UI 모드 — 호스트 브라우저에서 http://localhost:43210
set -eo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# 태그는 @playwright/test 버전과 일치(버전 올릴 때 함께 수정).
IMAGE="mcr.microsoft.com/playwright:v1.57.0-jammy"

echo "[e2e] 백엔드 스택 보장(pnpm api:up)…"
pnpm api:up

docker_args=(--rm --network csereal-local_default)
pw_args=("$@")
for a in "$@"; do
  if [ "$a" = "--ui" ]; then
    docker_args+=(-p 43210:43210)
    pw_args+=("--ui-host=0.0.0.0" "--ui-port=43210")
    echo "[e2e] UI 모드 — 호스트 브라우저에서 http://localhost:43210 열기"
  fi
done
[ -t 1 ] && docker_args+=(-it) # CI 등 TTY 없는 환경에선 비대화형

exec docker run "${docker_args[@]}" \
  -v "$PWD":/work -w /work \
  -v csereal-e2e-nm-root:/work/node_modules \
  -v csereal-e2e-nm-apps-web:/work/apps/web/node_modules \
  -v csereal-e2e-nm-e2e:/work/e2e/node_modules \
  -v csereal-e2e-pnpm-store:/pnpm-store \
  -e CI=1 \
  -e GITHUB_ACTIONS \
  -e E2E_BACKEND_URL=http://backend:8080 \
  -e E2E_DB_HOST=db \
  "$IMAGE" bash -c '
    set -eo pipefail
    corepack enable
    pnpm config set store-dir /pnpm-store
    pnpm install --frozen-lockfile

    # API 타입 드리프트 게이트 — 커밋된 generated.d.ts 가 이 커밋의 백엔드 스펙과 같은가.
    # 백엔드가 어차피 떠 있어 공짜다. 어긋나면 pnpm gen:api 로 다시 만들어 커밋한다.
    pnpm --filter web exec openapi-typescript http://backend:8080/api-docs/json -o /tmp/generated.d.ts >/dev/null
    if ! diff -q apps/web/src/types/api/generated.d.ts /tmp/generated.d.ts >/dev/null; then
      echo "[e2e] ✗ API 타입이 백엔드 스펙과 다르다. \`pnpm gen:api\` 를 돌려 커밋할 것." >&2
      diff apps/web/src/types/api/generated.d.ts /tmp/generated.d.ts | head -40 >&2
      exit 1
    fi
    echo "[e2e] API 타입 일치"

    exec pnpm -C e2e exec playwright test "$@"
  ' bash "${pw_args[@]}" # bash -c의 첫 인자가 $0이 되므로 자리채움 "bash" 뒤에 실제 인자
