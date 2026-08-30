/**
 * 검색 파라미터를 loader 의존성으로 선언한다.
 *
 * TanStack Router의 route match id는 `routeId + 보간된 경로 + JSON(loaderDeps)`다.
 * loaderDeps가 없으면 **검색 파라미터만 바뀌는 클라 네비게이션은 같은 match로 취급돼
 * loader가 다시 돌지 않는다**(load-matches의 staleMatchShouldReload가 cause==='enter'
 * 또는 match id 변경일 때만 참).
 * 빠뜨리면 예약 캘린더 날짜 이동·목록 페이지네이션·태그 필터·검색이 URL만 바뀌고
 * 화면은 그대로가 된다(2026-07 13개 라우트에서 실제로 겪음).
 *
 * E2E가 못 잡은 이유: read 스펙은 상태를 URL로 직접 goto(=전체 문서 로드 → SSR에서
 * loader 실행)해서 검증하므로 클라 네비게이션 경로를 타지 않는다.
 *
 * → `location.searchStr`을 읽는 loader는 반드시 이 deps를 함께 선언한다.
 *   (검색 파라미터를 바꾸는 컨트롤을 도메인당 1개 클릭하는 E2E가 재실행을 검증한다)
 */
export const searchLoaderDeps = <T>({ search }: { search: T }): T => search;
