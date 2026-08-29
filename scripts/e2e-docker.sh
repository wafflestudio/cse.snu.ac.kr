#!/usr/bin/env bash
# E2E 단일 진입점 — `pnpm test`가 부른다.
#   1) 백엔드 스택(루트 compose.yml: db·oidc-stub·backend)을 `up --wait`로 보장
#   2) 핀된 Playwright 컨테이너를 스택 네트워크에 붙여 테스트 실행
# 컨테이너 고정 이유: 비주얼 baseline(*-linux.png)은 폰트 렌더 환경 종속 — 이 이미지가 정본.
#
# 사용:
#   pnpm test                       # 전체 검증(Linux baseline 대조)
#   pnpm test --update-snapshots    # baseline 재생성(호스트 tests/에 PNG 기록)
#   pnpm test tests/research/labs   # 특정 경로/프로젝트 등 인자 패스스루
#   pnpm test:ui                    # UI 모드 — 호스트 브라우저에서 http://localhost:43210
set -eo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# 태그는 @playwright/test 버전과 일치(버전 올릴 때 함께 수정).
IMAGE="mcr.microsoft.com/playwright:v1.57.0-jammy"

echo "[e2e] 백엔드 스택 보장(compose up --wait)…"
docker compose up -d --wait backend

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
  -v csereal-e2e-node-modules:/work/node_modules \
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
    exec pnpm exec playwright test "$@"
  ' bash "${pw_args[@]}" # bash -c의 첫 인자가 $0이 되므로 자리채움 "bash" 뒤에 실제 인자
