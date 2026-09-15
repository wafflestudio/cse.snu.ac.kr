#!/usr/bin/env bash
# 학습용 TSV 를 만든다. 인자는 mysql 을 실행할 방법 — 기본값은 로컬 docker 다.
#   ./dump.sh > notices.tsv
# 운영 데이터로 학습하려면 운영 호스트에서 같은 쿼리를 돌려 받아온다.
set -euo pipefail
CONTAINER=${CONTAINER:-csereal_db_container}
SINCE=${SINCE:-2022-09-01}   # 태깅 컨벤션이 지금과 같은 구간만. 그 이전은 기준이 달랐다.
docker exec -i "$CONTAINER" sh -c \
  'mysql --default-character-set=utf8mb4 -uroot -p"$MYSQL_ROOT_PASSWORD" csereal_db -N -B' <<SQL
SELECT n.id,
       DATE(n.created_at),
       COALESCE((SELECT GROUP_CONCAT(t.name SEPARATOR '|')
                   FROM notice_tag k JOIN tag_in_notice t ON t.id = k.tag_id
                  WHERE k.notice_id = n.id), ''),
       REPLACE(REPLACE(n.title, '\t', ' '), '\n', ' '),
       REPLACE(REPLACE(LEFT(n.plain_text_description, 1000), '\t', ' '), '\n', ' ')
  FROM notice n
 WHERE n.created_at >= '$SINCE'
 ORDER BY n.id;
SQL
