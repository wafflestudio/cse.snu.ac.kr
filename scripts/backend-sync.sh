#!/usr/bin/env bash
# 백엔드 develop 이 staging 에 배포된 뒤 실행한다. E2E 백엔드 핀과 API 타입을 그 커밋으로 맞춘다.
#   pnpm backend:sync          # 백엔드 origin/develop HEAD
#   pnpm backend:sync <sha>
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

REF=${1:-$(git ls-remote https://github.com/wafflestudio/csereal-server.git refs/heads/develop | cut -f1)}
API_DOCS_URL=${API_DOCS_URL:-https://168.107.16.249.nip.io/api-docs/json}
[ -n "$REF" ] || { echo "백엔드 커밋을 못 찾았다" >&2; exit 1; }

sed -i.bak -E "s/^( *BACKEND_REF: ).*/\1$REF/" .github/workflows/ci.yml && rm .github/workflows/ci.yml.bak
echo "BACKEND_REF=$REF"

pnpm exec openapi-typescript "$API_DOCS_URL" -o src/types/api/generated.d.ts
pnpm typecheck

echo "렌더가 바뀌었으면: pnpm test --update-snapshots"
