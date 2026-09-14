-- '수업' 태그를 없앤다. V25 가 목적지 태그를 이미 가진 1,016건을 정리했고, 나머지 191건은
-- 본문을 읽어 학사(학부)·학사(대학원)로 옮겼다(둘 다 93 · 학부 70 · 대학원 4 · 수업 아님 24).
-- 그 결과 연결이 0이 되어 이제 지울 수 있다.
--
-- 왜 없애나: '수업'과 '학사(학부)'가 동시에 붙은 공지가 954건이었다 — 사람도 경계를 못 그었다.
-- 최근 비중도 7.9%로 기준선(14.6%)의 절반이라 운영자가 이미 학사(학부)로 옮겨 가 있었다.

DELETE nt FROM notice_tag nt JOIN tag_in_notice t ON t.id = nt.tag_id WHERE t.name = 'CLASS';
DELETE FROM tag_in_notice WHERE name = 'CLASS';

ALTER TABLE tag_in_notice
    MODIFY COLUMN name ENUM (
        'SCHOLARSHIP', 'UNDERGRADUATE', 'GRADUATE', 'MINOR',
        'ADMISSIONS', 'GRADUATIONS', 'RECRUIT', 'STUDENT_EXCHANGE',
        'INNER_EVENTS_PROGRAMS', 'OUTER_EVENTS_PROGRAMS', 'INTERNATIONAL',
        'CONTESTS', 'CAMPUS_LIFE'
        ) NULL;
