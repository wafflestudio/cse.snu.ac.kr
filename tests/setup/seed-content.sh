#!/usr/bin/env bash
# content 싱글톤(about overview/greetings/history/contact 등)을 SQL로 직접 시드한다.
#
# 왜 SQL인가: 이 콘텐츠들은 PUT(updateAbout)이 기존 행을 전제로 하고(없으면 500),
# API로 생성하는 경로가 없다. reset이 행을 지우므로 SQL로 직접 ko/en 쌍 + 링크를 만든다.
# 다른 content 싱글톤(academics degree-requirements 등)도 같은 패턴으로 여기에 추가.
set -euo pipefail

CONTAINER="${E2E_DB_CONTAINER:-csereal-server-db-1}"
DB="${E2E_DB_NAME:-csereal}"
USER="${E2E_DB_USER:-root}"
PASS="${E2E_DB_PASSWORD:-password}"

# postType, ko 본문, en 본문
seed_about() {
  local pt="$1" ko="$2" en="$3"
  echo "
INSERT INTO about (post_type, language, description, search_content, created_at, modified_at)
  VALUES ('$pt','KO','$ko','', NOW(), NOW());
SET @ko = LAST_INSERT_ID();
INSERT INTO about (post_type, language, description, search_content, created_at, modified_at)
  VALUES ('$pt','EN','$en','', NOW(), NOW());
SET @en = LAST_INSERT_ID();
INSERT INTO about_language (korean_id, english_id, created_at, modified_at)
  VALUES (@ko, @en, NOW(), NOW());
"
}

# 찾아오는 길(DIRECTIONS)도 PUT만 있고 생성 API가 없는 멀티-행 콘텐츠.
# seed_about과 달리 행마다 name(ko/en)이 필요하다(DirDto.name!!). koName, enName, ko본문, en본문.
seed_direction() {
  local koname="$1" enname="$2" ko="$3" en="$4"
  echo "
INSERT INTO about (post_type, language, name, description, search_content, created_at, modified_at)
  VALUES ('DIRECTIONS','KO','$koname','$ko','', NOW(), NOW());
SET @ko = LAST_INSERT_ID();
INSERT INTO about (post_type, language, name, description, search_content, created_at, modified_at)
  VALUES ('DIRECTIONS','EN','$enname','$en','', NOW(), NOW());
SET @en = LAST_INSERT_ID();
INSERT INTO about_language (korean_id, english_id, created_at, modified_at)
  VALUES (@ko, @en, NOW(), NOW());
"
}

# academics 콘텐츠 싱글톤(guide/degree-requirements 등). PUT만 있고 빈 DB면 404.
# academics 테이블에 language별 독립 행(페어링 테이블 없음). post_type, student_type, ko, en.
seed_academics() {
  local pt="$1" st="$2" ko="$3" en="$4"
  echo "
INSERT INTO academics (post_type, student_type, language, description, created_at, modified_at)
  VALUES ('$pt','$st','KO','$ko', NOW(), NOW());
INSERT INTO academics (post_type, student_type, language, description, created_at, modified_at)
  VALUES ('$pt','$st','EN','$en', NOW(), NOW());
"
}

# admissions 콘텐츠 싱글톤(main_type/post_type별 ko/en). PUT만 있고 빈 DB면 404.
seed_admissions() {
  local mt="$1" pt="$2" ko="$3" en="$4"
  # name은 AdmissionsDto에서 non-null이라 빈 문자열로라도 채워야 한다(NULL이면 500).
  echo "
INSERT INTO admissions (main_type, post_type, language, name, description, search_content, created_at, modified_at)
  VALUES ('$mt','$pt','KO','','$ko','', NOW(), NOW());
INSERT INTO admissions (main_type, post_type, language, name, description, search_content, created_at, modified_at)
  VALUES ('$mt','$pt','EN','','$en','', NOW(), NOW());
"
}

SQL="$(
  seed_about OVERVIEW  '<p>학부 소개 본문입니다.</p>'        '<p>Department overview.</p>'
  seed_about GREETINGS '<p>학부장 인사말입니다.</p>'        '<p>Greetings from the chair.</p>'
  seed_about HISTORY   '<p>학부 연혁입니다.</p>'            '<p>Department history.</p>'
  seed_about FUTURE_CAREERS '<p>졸업생 진로 안내 본문입니다.</p>' '<p>Career paths overview.</p>'
  seed_about CONTACT   '<p>연락처 안내입니다.</p>'          '<p>Contact information.</p>'
  seed_direction '대중교통' 'By Public Transit' '<p>지하철 2호선 서울대입구역에서 버스 환승.</p>' '<p>Subway Line 2 to SNU Station, then bus.</p>'
  seed_direction '자가용'   'By Car'            '<p>관악 캠퍼스 정문으로 진입.</p>'              '<p>Enter via the Gwanak main gate.</p>'
  seed_academics GUIDE UNDERGRADUATE '<p>학부 안내 본문입니다.</p>'   '<p>Undergraduate guide.</p>'
  seed_academics GUIDE GRADUATE      '<p>대학원 안내 본문입니다.</p>' '<p>Graduate guide.</p>'
  seed_academics DEGREE_REQUIREMENTS UNDERGRADUATE '<p>졸업 규정 본문입니다.</p>' '<p>Degree requirements.</p>'
  seed_academics SCHOLARSHIP UNDERGRADUATE '<p>장학 제도 안내입니다.</p>' '<p>Scholarships intro.</p>'
  seed_admissions UNDERGRADUATE REGULAR_ADMISSION '<p>학부 정시 모집 안내입니다.</p>'   '<p>Undergraduate regular admission.</p>'
  seed_admissions UNDERGRADUATE EARLY_ADMISSION   '<p>학부 수시 모집 안내입니다.</p>'   '<p>Undergraduate early admission.</p>'
  seed_admissions GRADUATE      REGULAR_ADMISSION '<p>대학원 모집 안내입니다.</p>'      '<p>Graduate admission.</p>'
  seed_admissions INTERNATIONAL UNDERGRADUATE     '<p>외국인 학부 모집 안내입니다.</p>'  '<p>International undergraduate.</p>'
  seed_admissions INTERNATIONAL GRADUATE          '<p>외국인 대학원 모집 안내입니다.</p>' '<p>International graduate.</p>'
  seed_admissions INTERNATIONAL EXCHANGE_VISITING '<p>교환·방문 학생 안내입니다.</p>'    '<p>Exchange and visiting students.</p>'
  seed_admissions INTERNATIONAL SCHOLARSHIPS      '<p>외국인 장학 안내입니다.</p>'      '<p>International scholarships.</p>'
)"

# Top Conference List: getConferencePage/modifyConferences가 conference_page 행을 전제(findAll()[0]).
# 생성 API가 없어 SQL로 빈 행 1개를 만든다(author_id는 시더의 PATCH가 staff로 채움).
SQL="$SQL
INSERT INTO conference_page (created_at, modified_at, author_id) VALUES (NOW(), NOW(), NULL);
"

# 예약 방(room): 참조 데이터인데 Flyway 시드가 없고(운영은 수동 삽입) reset이 truncate함.
# 프론트 roomNameToId(1~16)와 id를 맞춰 16개 방을 시드(없으면 예약 생성이 'Room Not Found').
# location은 ReservationDto.roomLocation이 non-null이라 반드시 채운다(NULL이면 예약 생성 500).
SQL="$SQL
INSERT INTO room (id, capacity, name, location, type, created_at, modified_at) VALUES
 (1,20,'301-417','301동','SEMINAR',NOW(),NOW()),(2,11,'301-521','301동','SEMINAR',NOW(),NOW()),
 (3,20,'301-551-4','301동','SEMINAR',NOW(),NOW()),(4,4,'301-552-1','301동','SEMINAR',NOW(),NOW()),
 (5,5,'301-552-2','301동','SEMINAR',NOW(),NOW()),(6,4,'301-552-3','301동','SEMINAR',NOW(),NOW()),
 (7,6,'301-553-6','301동','SEMINAR',NOW(),NOW()),(8,20,'301-317','301동','SEMINAR',NOW(),NOW()),
 (9,10,'302-308','302동','SEMINAR',NOW(),NOW()),(10,10,'302-309-1','302동','SEMINAR',NOW(),NOW()),
 (11,10,'302-309-2','302동','SEMINAR',NOW(),NOW()),(12,10,'302-309-3','302동','SEMINAR',NOW(),NOW()),
 (13,30,'302-311-1','302동','LAB',NOW(),NOW()),(14,30,'302-310-2','302동','LAB',NOW(),NOW()),
 (15,54,'302-208','302동','LECTURE',NOW(),NOW()),(16,70,'302-209','302동','LECTURE',NOW(),NOW());
"

docker exec -i "$CONTAINER" mysql --default-character-set=utf8mb4 -u"$USER" -p"$PASS" "$DB" -e "$SQL" 2>/dev/null
echo "[seed-content] about content 싱글톤 시드 완료"
