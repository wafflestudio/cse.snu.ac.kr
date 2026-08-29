#!/usr/bin/env bash
# e2e 서비스(compose.yml)의 entrypoint — 컨테이너 안 부트스트랩 후 playwright 실행.
# 컨테이너는 매 런 새로 뜨므로(run --rm) 여기서 의존성을 보장한다(볼륨 캐시로 빠름).
set -eo pipefail

corepack enable
pnpm config set store-dir /pnpm-store
pnpm install --frozen-lockfile

# 시드/리셋 스크립트가 mysql 클라이언트로 db:3306 TCP 접속(caching_sha2 → mysql 8 클라이언트).
command -v mysql >/dev/null 2>&1 || {
  apt-get update -qq
  apt-get install -y -qq --no-install-recommends mysql-client-core-8.0
}

exec pnpm exec playwright test "$@"
