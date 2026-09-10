#!/usr/bin/env bash
# 백엔드 OpenAPI 스펙에서 프론트 API 타입을 다시 만든다. 기본은 staging swagger.
#   pnpm gen:api
#   API_DOCS_URL=http://localhost:8080/api-docs/json pnpm gen:api   # 로컬 백엔드(pnpm backend:up) 기준
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

API_DOCS_URL=${API_DOCS_URL:-https://168.107.16.249.nip.io/api-docs/json}

pnpm --filter web exec openapi-typescript "$API_DOCS_URL" -o src/types/api/generated.d.ts
pnpm -r typecheck

echo "렌더가 바뀌었으면: pnpm test --update-snapshots"
