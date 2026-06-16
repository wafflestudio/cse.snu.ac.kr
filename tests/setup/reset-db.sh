#!/usr/bin/env bash
# 로컬 docker 백엔드 DB를 비웁니다(flyway 이력은 보존 → 스키마 유지).
# TRUNCATE로 auto-increment까지 초기화하여 시드 id가 매 런 동일하게 유지됩니다.
# 로컬 전용(격리·리셋 자유)이므로 안전합니다. (staging/프로덕션은 절대 건드리지 않음)
set -euo pipefail

CONTAINER="${E2E_DB_CONTAINER:-csereal-server-db-1}"
DB="${E2E_DB_NAME:-csereal}"
USER="${E2E_DB_USER:-root}"
PASS="${E2E_DB_PASSWORD:-password}"

tables=$(docker exec "$CONTAINER" mysql -u"$USER" -p"$PASS" -Nse \
  "SELECT table_name FROM information_schema.tables \
   WHERE table_schema='$DB' AND table_name<>'flyway_schema_history'" 2>/dev/null)

stmt="SET FOREIGN_KEY_CHECKS=0;"
for t in $tables; do
  stmt="$stmt TRUNCATE TABLE \`$t\`;"
done
stmt="$stmt SET FOREIGN_KEY_CHECKS=1;"

docker exec "$CONTAINER" mysql -u"$USER" -p"$PASS" "$DB" -e "$stmt" 2>/dev/null
echo "[reset-db] $DB 의 모든 테이블을 비웠습니다"
