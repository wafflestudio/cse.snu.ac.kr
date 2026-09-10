#!/usr/bin/env bash
# 프론트 API 타입(apps/web/src/types/api/generated.d.ts)을 이 커밋의 백엔드 스펙에서 다시 만든다.
# 기본은 로컬 백엔드(루트 compose 로 apps/server 를 띄운다). 배포된 서버를 보려면 API_DOCS_URL 로 지정.
#   pnpm gen:api
#   API_DOCS_URL=https://168.107.16.249.nip.io/api-docs/json pnpm gen:api
# pnpm test 가 같은 비교를 해서 어긋나면 실패한다(scripts/e2e-docker.sh).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [ -z "${API_DOCS_URL:-}" ]; then
  docker compose up -d --build --wait backend
  API_DOCS_URL=http://localhost:8080/api-docs/json
fi

pnpm --filter web exec openapi-typescript "$API_DOCS_URL" -o src/types/api/generated.d.ts
pnpm -r typecheck

echo "렌더가 바뀌었으면: pnpm test --update-snapshots"
