#!/usr/bin/env bash
# 커밋된 OpenAPI 생성 타입이 백엔드 실제 스펙과 어긋났는지 검사한다.
#   백엔드가 응답 모양을 바꿨는데 프론트가 안 따라오면 여기서 빨간불이 난다.
#   (전엔 이런 변화가 런타임에만 드러났다.)
#
# 로컬에서 어긋났을 때: `pnpm gen:api` 후 typecheck가 깨진 호출부를 짚어준다.
#
# e2e-docker.sh와 같은 핀된 컨테이너·같은 compose 스택을 쓴다(두 벌 관리 X).
set -eo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

IMAGE="mcr.microsoft.com/playwright:v1.57.0-jammy" # e2e-docker.sh와 같은 태그 유지

echo "[drift] 백엔드 스택 보장(compose up --build --wait)…"
docker compose up -d --build --wait backend

echo "[drift] 스펙에서 타입 재생성…"
docker run --rm \
  --network csereal-local_default \
  -v "$PWD":/work -w /work \
  -v csereal-e2e-node-modules:/work/node_modules \
  -v csereal-e2e-pnpm-store:/pnpm-store \
  -e API_DOCS_URL=http://backend:8080/api-docs/json \
  "$IMAGE" bash -c '
    set -eo pipefail
    corepack enable
    pnpm config set store-dir /pnpm-store
    pnpm install --frozen-lockfile
    pnpm gen:api
  '

GEN=src/types/api/generated.d.ts

# untracked면 `git diff`가 무조건 통과하므로 먼저 추적 여부를 본다.
if ! git ls-files --error-unmatch "$GEN" >/dev/null 2>&1; then
  echo "[drift] ❌ $GEN 이 커밋돼 있지 않습니다. 생성물을 커밋하세요."
  exit 1
fi

if ! git diff --quiet -- "$GEN"; then
  echo "[drift] ❌ 커밋된 타입이 백엔드 스펙과 다릅니다. 아래 diff를 커밋하세요:"
  git --no-pager diff -- "$GEN"
  exit 1
fi
echo "[drift] ✅ 일치"
