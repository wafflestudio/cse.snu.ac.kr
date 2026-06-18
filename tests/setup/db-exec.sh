#!/usr/bin/env bash
# DB 접속 단일 출처. reset-db / seed-content / normalize-dates가 source 한다.
#
# 두 경로를 분기한다(접속 방식만 다르고 자격증명·DB명 컨벤션은 동일):
#   - 로컬(기본):    docker exec "$E2E_DB_CONTAINER" mysql ...   (소켓 인증, docker 필요)
#   - CI/컨테이너:   E2E_DB_HOST 설정 시 mysql -h$E2E_DB_HOST    (TCP, docker 불필요)
#
# Playwright를 핀된 컨테이너 안에서 돌릴 때(scripts/e2e-docker.sh), 컨테이너에는 docker
# 소켓을 넣지 않고 host.docker.internal:3306으로 TCP 접속한다. MySQL 8 기본 인증
# (caching_sha2_password)은 비-TLS TCP에서 서버 공개키가 필요하므로 --get-server-public-key.

CONTAINER="${E2E_DB_CONTAINER:-csereal-server-db-1}"
DB="${E2E_DB_NAME:-csereal}"
USER="${E2E_DB_USER:-root}"
PASS="${E2E_DB_PASSWORD:-password}"

run_mysql() {
  if [ -n "${E2E_DB_HOST:-}" ]; then
    mysql --protocol=TCP -h"$E2E_DB_HOST" -P"${E2E_DB_PORT:-3306}" \
      --get-server-public-key -u"$USER" -p"$PASS" "$@"
  else
    docker exec -i "$CONTAINER" mysql -u"$USER" -p"$PASS" "$@"
  fi
}
