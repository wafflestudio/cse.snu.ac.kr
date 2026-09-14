-- 공지 태그 둘을 추가한다. 최근 12개월 1,325건을 전수로 훑어 크기를 재고 정했다.
--
-- 공모전/대회 53건: 채용정보 21 · 외부행사 16 · 내부행사 4 · 태그없음 2 · 기타 10 으로 흩어져
--   "공모전만 보기" 가 안 됐다. 연 53건은 입학(28)·졸업(28)·다전공(23)의 두 배다.
-- 시설/생활 25건: 15건이 태그 없음(갈 곳이 없어서), 6건은 건물 통제·사물함을 학사(학부)로
--   억지로 넣은 것이다.
--
-- ENUM 은 끝에 붙인다 — 중간에 끼우면 기존 값의 내부 인덱스가 밀린다.
ALTER TABLE tag_in_notice
    MODIFY COLUMN name ENUM (
        'CLASS', 'SCHOLARSHIP', 'UNDERGRADUATE', 'GRADUATE', 'MINOR',
        'ADMISSIONS', 'GRADUATIONS', 'RECRUIT', 'STUDENT_EXCHANGE',
        'INNER_EVENTS_PROGRAMS', 'OUTER_EVENTS_PROGRAMS', 'INTERNATIONAL',
        'CONTESTS', 'CAMPUS_LIFE'
        ) NULL;
