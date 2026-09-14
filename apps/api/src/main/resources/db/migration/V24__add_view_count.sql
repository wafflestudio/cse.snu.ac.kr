-- 게시물 조회수. 증가는 상세 GET 이 아니라 전용 POST 가 한다 —
-- 프런트가 링크 hover 만으로 loader 를 미리 돌리고(preload intent), SSR·프리렌더·봇도 GET 을 내기 때문.
ALTER TABLE notice ADD COLUMN view_count BIGINT NOT NULL DEFAULT 0;
ALTER TABLE news ADD COLUMN view_count BIGINT NOT NULL DEFAULT 0;
ALTER TABLE seminar ADD COLUMN view_count BIGINT NOT NULL DEFAULT 0;
