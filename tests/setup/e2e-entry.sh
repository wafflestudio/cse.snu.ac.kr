#!/usr/bin/env bash
# e2e 서비스(compose.yml)의 entrypoint — 컨테이너 안 부트스트랩 후 playwright 실행.
# 컨테이너는 매 런 새로 뜨므로(run --rm) 여기서 의존성을 보장한다(볼륨 캐시로 빠름).
set -eo pipefail

corepack enable
pnpm config set store-dir /pnpm-store
pnpm install --frozen-lockfile

exec pnpm exec playwright test "$@"
