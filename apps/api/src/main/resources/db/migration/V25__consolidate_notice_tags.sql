-- 공지 태그 어휘 정리 1단계. 판단이 필요 없는 것만 옮긴다 —
-- 목적지 태그가 이미 붙어 있거나, 규칙만으로 결정되는 경우다.
-- 게시물을 읽어야 정해지는 것(레벨 없는 '수업' 191건, international, 내부/외부 오분류)은
-- 손대지 않는다. 그래서 CLASS 는 enum 에 남는다.

-- 1) '등록/복학/휴학/재입학' 을 학사(학부)·학사(대학원) 으로 흡수한다.
--    196건 중 151건이 레벨 태그가 없어 학부·대학원 필터 어디에도 안 잡히고 있었다.
--    레벨이 이미 명시된 45건은 사람이 내린 판단이라 덮지 않는다.
CREATE TEMPORARY TABLE tmp_registrations_without_level AS
SELECT DISTINCT nt.notice_id
FROM notice_tag nt
         JOIN tag_in_notice t ON t.id = nt.tag_id AND t.name = 'REGISTRATIONS'
WHERE NOT EXISTS (SELECT 1
                  FROM notice_tag lvl
                           JOIN tag_in_notice lt ON lt.id = lvl.tag_id
                  WHERE lvl.notice_id = nt.notice_id
                    AND lt.name IN ('UNDERGRADUATE', 'GRADUATE'));

-- 등록·휴학 마감을 못 보는 쪽이 한 번 더 보는 쪽보다 손해가 크다 → 애매하면 둘 다 준다.
INSERT INTO notice_tag (notice_id, tag_id, created_at, modified_at)
SELECT r.notice_id, lvl.id, NOW(6), NOW(6)
FROM tmp_registrations_without_level r
         CROSS JOIN tag_in_notice lvl
WHERE lvl.name IN ('UNDERGRADUATE', 'GRADUATE');

DROP TEMPORARY TABLE tmp_registrations_without_level;

DELETE nt
FROM notice_tag nt
         JOIN tag_in_notice t ON t.id = nt.tag_id
WHERE t.name = 'REGISTRATIONS';

DELETE FROM tag_in_notice WHERE name = 'REGISTRATIONS';

-- 2) '수업' 중 목적지 태그를 이미 가진 1,016건의 연결만 끊는다.
--    954건은 학사(학부)를, 62건은 학사(대학원)만 갖고 있다 —
--    후자를 학부로 밀면 틀리므로 레벨을 새로 주지 않고 '수업' 만 뗀다.
CREATE TEMPORARY TABLE tmp_class_links_to_drop AS
SELECT nt.id
FROM notice_tag nt
         JOIN tag_in_notice t ON t.id = nt.tag_id AND t.name = 'CLASS'
WHERE nt.notice_id IN (SELECT lvl.notice_id
                       FROM notice_tag lvl
                                JOIN tag_in_notice lt ON lt.id = lvl.tag_id
                       WHERE lt.name IN ('UNDERGRADUATE', 'GRADUATE'));

DELETE FROM notice_tag WHERE id IN (SELECT id FROM tmp_class_links_to_drop);

DROP TEMPORARY TABLE tmp_class_links_to_drop;

-- 3) 컬럼 정의에서 REGISTRATIONS 와 FOREIGN 을 뺀다.
--    FOREIGN 은 Kotlin enum·프론트 목록 어디에도 없고 행이 존재한 적도 없는 옛 스키마 잔재다.
--    ⚠️ 남은 값들은 위에서 이미 비웠거나 그대로 존재해야 한다 — MySQL 은 재정의 시 값을
--    문자열로 대조하고, 새 정의에 없는 값은 빈 문자열이 된다.
ALTER TABLE tag_in_notice
    MODIFY COLUMN name ENUM (
        'CLASS', 'SCHOLARSHIP', 'UNDERGRADUATE', 'GRADUATE', 'MINOR',
        'ADMISSIONS', 'GRADUATIONS', 'RECRUIT', 'STUDENT_EXCHANGE',
        'INNER_EVENTS_PROGRAMS', 'OUTER_EVENTS_PROGRAMS', 'INTERNATIONAL'
        ) NULL;
