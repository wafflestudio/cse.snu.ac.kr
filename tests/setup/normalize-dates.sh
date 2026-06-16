#!/usr/bin/env bash
# 게시물(notice/news/seminar 등)의 created_at/modified_at을 고정 시각으로 정규화한다.
#
# 왜: 이 날짜들은 서버가 생성 시각으로 박으므로(생성 payload로 제어 불가) 매 런 달라진다.
# 화면에 날짜·시간이 렌더되면 비주얼 baseline이 비결정적이 된다(특히 시:분의 글자 폭이
# 런마다 달라져 마스킹으로도 안정화가 어렵다). API 시드(seedBaseline) 직후 한 번 호출해
# 고정값으로 만들면 마스킹 없이 결정론이 유지된다(CLAUDE.md "데이터를 우리가 시드하므로 고정값").
#
# read(비주얼) 전에 globalSetup에서 실행된다. flow가 만드는 글은 이후 생성이라 영향 없음.
set -euo pipefail

CONTAINER="${E2E_DB_CONTAINER:-csereal-server-db-1}"
DB="${E2E_DB_NAME:-csereal}"
USER="${E2E_DB_USER:-root}"
PASS="${E2E_DB_PASSWORD:-password}"

FIXED='2024-03-15 09:00:00'

# 날짜가 화면에 노출되는 게시물 테이블. 도메인 추가 시 여기 한 줄 추가.
# conference_page는 modified_at(수정 날짜)이 Top Conference List에 노출된다.
SQL="
UPDATE notice SET created_at='$FIXED', modified_at='$FIXED';
UPDATE conference_page SET modified_at='$FIXED';
-- news 목록/상세는 payload date를 쓰지만, 메인 NewsCard는 created_at을 노출 → 메인 결정론용.
UPDATE news SET created_at='$FIXED', modified_at='$FIXED';
"

docker exec -i "$CONTAINER" mysql -u"$USER" -p"$PASS" "$DB" -e "$SQL" 2>/dev/null
echo "[normalize-dates] 게시물 날짜 정규화 완료"
