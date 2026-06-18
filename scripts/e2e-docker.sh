#!/usr/bin/env bash
# E2E의 단일 진입점. `pnpm test`가 이걸 부른다. 모든 테스트 실행은 핀된 Playwright
# 컨테이너 안에서 일어난다(로컬 직접 실행 없음 → 호스트 OS와 무관하게 결정론적).
#
# 왜 컨테이너인가: 비주얼 baseline(*-linux.png)은 폰트 렌더 환경에 종속이라, 호스트가
# macOS든 ubuntu(CI)든 같은 PNG를 내려면 렌더 환경을 고정해야 한다. 이 이미지가 그
# 단일 정본 환경이다 → 로컬 산출물 == CI 검증값.
#
# 역할 분담:
#   - 백엔드(MySQL+Spring)는 호스트 docker로 띄운다(컨테이너 안엔 docker가 없음).
#     이 스크립트가 호스트에서 보장하고, 컨테이너는 host.docker.internal로 TCP 접근한다.
#   - 앱 빌드·서빙·시드·브라우저·테스트는 전부 컨테이너 안.
#
# 사용:
#   pnpm test                       # 전체 검증(Linux baseline 대조)
#   pnpm test --update-snapshots    # baseline 재생성(호스트 tests/에 PNG 기록)
#   pnpm test tests/research/labs   # 특정 경로/프로젝트 등 인자 패스스루
#   pnpm test:ui                    # UI 모드 — 호스트 브라우저에서 http://localhost:$UI_PORT
set -eo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# @playwright/test 버전과 컨테이너 태그 일치(버전 올릴 때 함께 수정).
IMAGE="mcr.microsoft.com/playwright:v1.57.0-jammy"
# 백엔드 소스 디렉터리(로컬은 형제 ../csereal-server, CI는 워크스페이스 내 csereal-server).
BACKEND_DIR="${BACKEND_DIR:-../csereal-server}"
BACKEND_URL="http://localhost:8080"
PNPM_STORE="${PNPM_STORE:-$PWD/.pnpm-store}"
UI_PORT="${UI_PORT:-43210}"
COMPOSE="-f $BACKEND_DIR/docker-compose-local-full.yml -f tests/setup/backend/docker-compose-fe-test.yml"
mkdir -p "$PNPM_STORE"

# 1) 백엔드 보장(호스트). 이미 떠 있으면 재사용(이미지 있으면 빌드도 생략).
backend_healthy() { curl -fsS "$BACKEND_URL/api/v2/research/lab?language=ko" >/dev/null 2>&1; }
if backend_healthy; then
  echo "[e2e] 백엔드 이미 기동됨 → 재사용"
else
  echo "[e2e] 백엔드 기동(docker compose up)…"
  docker compose $COMPOSE up -d
  echo "[e2e] 백엔드 health 대기…"
  for i in $(seq 1 60); do
    backend_healthy && break
    if [ "$i" = 60 ]; then
      echo "::error::[e2e] 백엔드 기동 실패"
      docker compose $COMPOSE logs my_server || true
      exit 1
    fi
    sleep 5
  done
fi

# 2) 인자 처리. --ui면 UI 포트를 공개해 호스트 브라우저에서 본다.
docker_ui_args=()
pw_args=("$@")
for a in "$@"; do
  if [ "$a" = "--ui" ]; then
    docker_ui_args=(-p "$UI_PORT:$UI_PORT")
    pw_args+=("--ui-host=0.0.0.0" "--ui-port=$UI_PORT")
    echo "[e2e] UI 모드 — 호스트 브라우저에서 http://localhost:$UI_PORT 열기"
  fi
done

# TTY가 있을 때만 -it(로컬 대화형·UI). CI는 TTY 없음 → 비대화형.
tty_args=()
[ -t 1 ] && tty_args=(-it)

# 3) 핀된 컨테이너에서 실행. 백엔드·DB는 host.docker.internal로(소켓 불필요).
#    node_modules는 named volume으로 격리 — 호스트 macOS 바이너리를 덮어쓰지 않게.
exec docker run --rm "${tty_args[@]}" \
  --add-host=host.docker.internal:host-gateway \
  "${docker_ui_args[@]}" \
  -v "$PWD":/work -w /work \
  -v csereal-e2e-node-modules:/work/node_modules \
  -v "$PNPM_STORE":/pnpm-store \
  -e CI=1 \
  -e E2E_BACKEND_URL=http://host.docker.internal:8080 \
  -e E2E_DB_HOST=host.docker.internal \
  "$IMAGE" \
  bash -lc '
    set -eo pipefail
    corepack enable
    pnpm config set store-dir /pnpm-store
    pnpm install --frozen-lockfile
    # 시드 스크립트가 host.docker.internal:3306으로 TCP 접속(caching_sha2 → mysql 8 클라이언트).
    command -v mysql >/dev/null 2>&1 || {
      apt-get update -qq
      apt-get install -y -qq --no-install-recommends mysql-client-core-8.0
    }
    exec pnpm exec playwright test "$@"
  ' bash "${pw_args[@]}"
