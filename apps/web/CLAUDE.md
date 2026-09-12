# apps/web 작업 가이드

프론트(TanStack Start + Hono). 레포 전체 규칙·환경·CI/CD 는 루트 `CLAUDE.md`, E2E 는 `e2e/CLAUDE.md`. 여기 경로는 이 디렉터리 기준.

# server.ts

TanStack Start 빌드는 `dist/server/server.js` 를 **Web fetch 핸들러**로 내놓는데 Node HTTP 서버는 `IncomingMessage`/`ServerResponse` 라 Node↔Web 다리가 필연이다. Hono(+`@hono/node-server`)가 그 변환·정적 서빙·`/api` 프록시(`API_PROXY_TARGET` 있을 때만)·gzip(`hono/compress`)을 맡는다. prod 컨테이너와 E2E 가 같은 서버를 쓴다 — E2E 가 dev 서버가 아니라 **프로덕션 빌드**를 검증하는 이유(dev≠prod 면 비주얼 회귀가 무의미).

# 라우팅 · 코드 컨벤션

- **file-based**(`src/routes/**` → 생성 `routeTree.gen.ts`). loader 는 `createFileRoute` 에 인라인. 컴포넌트는 `Route.useLoaderData()`/`useParams()` 를 직접 호출(prop 주입 안 함) → params 자동 타입.
- **로케일은 required path param `$locale`** — `src/routes/$locale/**` 한 벌(`/ko/about`·`/en/about`). 모든 페이지가 프리픽스를 가진다. 비로케일 라우트(`admin`·`[.]internal`·`img`·`sitemap`)는 `$locale` 밖. `__root` beforeLoad 가 프리픽스 없는 경로를 쿠키(`lang`)·Accept-Language 로 판정해 302.
- **⚠️ 로케일 링크는 항상 `localizedPath()`. `/${locale}/...` 문자열 조립 금지** — ko 에서 `/ko/...` 를 클라 네비로 클릭하면 `__root` 의 `/ko`-strip redirect 가 렌더 루프(메인스레드 peg)를 일으킨다. `localizedPath` 는 ko 에서 프리픽스 없는 경로를 만들어 그 라운드트립을 없앤다.
- **mutation 은 클라 `fetch`**(same-origin proxy 경유). `action` 은 거의 없음.
- **검색/페이지네이션은 공용 `src/hooks/useSearchParams.ts`**(URLSearchParams). 여러 라우트가 Pagination·SearchBox·TagCheckboxes 를 공유해 라우트별 `validateSearch` 타입은 부적합.
- **⚠️ 검색 파라미터를 읽는 loader 는 `loaderDeps: searchLoaderDeps`(`src/utils/loaderDeps.ts`) 필수.** match id 가 `routeId+경로+JSON(loaderDeps)` 라 선언이 없으면 검색 파라미터만 바뀌는 클라 네비에서 loader 가 재실행되지 않는다(URL 만 바뀌고 화면 그대로). 누락은 E2E 클릭 테스트로 잡는다 — 새 검색 파라미터 라우트에는 그 클릭 테스트를 반드시 추가(`e2e/CLAUDE.md`).
- **API 타입은 백엔드 OpenAPI 스펙에서 생성**(`pnpm gen:api` → `src/types/api/generated.d.ts`). `src/types/api/index.ts` 가 도메인별 별칭만 모으고, 추출은 `helpers.ts` 의 `Res<'/api/v2/notice/{noticeId}'>`.
  - **경로로 주소를 잡는 이유:** operationId 는 springdoc 이 중복 메서드명에 번호를 붙여(`searchTop_1`) 컨트롤러가 하나 늘면 밀린다. 스키마 이름도 `{total, searchList}` 같은 공용 래퍼가 겹친다.
  - ⚠️ **요청 바디엔 `Res` 를 쓰지 않는다.** 응답의 optional 은 "값이 null", 요청의 optional 은 "생략 가능"이라 뜻이 다르다. 요청은 `components['schemas'][...]` 그대로.
  - ⚠️ `Res` 가 `?` 를 떼는 전제는 백엔드 Jackson 의 `default-property-inclusion=ALWAYS`. 백엔드가 `non_null` 로 바꾸면 이 매핑을 지워야 한다.
  - 전제: springdoc 2.8.17+. 2.4.0 은 Kotlin `T?` 를 nullable 로 안 적어 타입이 런타임과 어긋났다.
- **서버 라우트(Response 직접 반환):** `/img`(이미지 최적화 프록시 — sharp·AVIF·디스크 캐시·SSRF 화이트리스트)와 `/sitemap.xml`. `/img` 가 시스템 유일의 이미지 최적화 계층 — 백엔드는 원본만, DB 엔 원본 URL 만, `Image` 컴포넌트와 본문 손질(`serverFns/prepareHtmlForViewer`)이 렌더 때 `/img?url=` 을 만든다. 허용 호스트 목록은 `utils/imageUrl.ts` 한 곳(핸들러와 URL 빌더가 같은 목록).
- **본문 HTML 은 백엔드가 세탁한 것을 그대로 믿는다.** 프론트는 strict CSP 를 위해 인라인 style 을 nonce `<style>` 클래스로 바꾸고 `<img>` 를 `/img` 로 보내는 손질만 한다(`prepareHtmlForViewer`). 링크·태그·CSS 허용 여부를 여기서 판단하지 않는다. 에디터(SunEditor)는 `strictMode:false` 로 자체 정리를 끄고 붙여넣기를 `POST /api/v2/content/sanitize` 로 보낸다 — 규칙은 서버 하나. suneditor CSS 는 패키지에서 import 하고 우리 몫만 override 파일 둘.
- **TanStack 함정:** 같은 라우트 재진입 시 컴포넌트를 재마운트 안 할 수 있다 → `useState(props)` 초기화 안 됨, URL/props 파생으로. 클라 네비 시 loader 가 클라에서 실행 → 합성 request 엔 쿠키 없음, 인증 의존 loader 는 `forwardAuthHeaders` 로 서버 헤더 전달(비공개 개념 있는 도메인의 loader 를 새로 만들면 이것부터). `getRequestHeaders()` 는 Headers 객체(`.get()`).
- **strict CSP:** `<style precedence>` 는 React 가 head 로 hoist 하며 nonce 를 비운다(TanStack 이 문자열 nonce 를 넘기기 때문). 본문 `<style>` 은 precedence 없이 in-place 렌더해야 nonce 가 붙는다(`HTMLViewer`).

# 디렉터리 · 파일 구조

- **라우트는 URL 을 미러링**(`src/routes/$locale/<path>`). 라우트별 비라우트 파일은 같은 폴더에 co-locate 하고 이름을 **`-` 로 시작**(`-components/`·`-hooks/`·`-api.ts`). TanStack Router 기본 `routeFileIgnorePrefix='-'` 가 라우트 생성에서 뺀다. 하위 폴더는 부모가 `-` 면 따라 제외. `vite.config.ts` 에 커스텀 `routeFileIgnorePattern` 을 두지 않는다.
- **공용 `src/components/`**: `ui`(제어 프리미티브, value/onChange) · `form`(폼 전용 — `FormProvider` 전제) · `layout`(앱 셸) · `feature`(도메인 위젯). route-specific 은 co-locate, 여러 라우트서 재사용하면 승격. DS 프리미티브는 사용처 1곳이어도 `ui/`.
- **헬퍼는 `src/utils/` 한 곳.** 서버 전용 보장은 `createServerFn`·서버 라우트 핸들러가 한다 — serverFn 은 `src/serverFns/`(폴더 README 에 규칙). 무거운 서버 전용 deps(cheerio·sharp)는 **handler 안 dynamic import 로만** 참조한다. top-level 로 빼면 조용히 클라 번들이 오염된다.

# 디자인 시스템

- **토큰:** `src/app.css` 의 `@theme`. 가로 페이지 거터는 `.page-gutter-x` 단일 출처. 토큰화·스케일화는 픽셀 동일할 때만 자율, 값이 바뀌는 정규화는 디자인 결정 → 합의.
- **`ui/*` 와 `form/*` 는 독립 구현.** 동명 컴포넌트가 어댑터 관계가 아니다. 의도된 분리 — 통합 금지.
- **DS 에 우겨넣지 않는다.** 일관성이 깨지는 사용처는 컴포넌트 API 확장이 아니라 앱 코드를 고친다.
- **단일 선택은 네이티브 radiogroup**(`fieldset`+`radio` pill) — 그룹 시맨틱·화살표 키 이동을 브라우저가 준다. Button `variant` 는 상태 없는 5개(primary/neutral/secondary/quiet/nav), 아이콘은 children 에 직접.
- **a11y:** form Radio/Checkbox 네이티브, Dialog/AlertDialog/Select/ImageModal 은 Radix. icon-only Button 은 `ariaLabel` 필수.
- Storybook 없음. 픽셀 회귀는 E2E 소유.
- **합의 대기(자율 실행 금지):** `#202020`(공지 필터 pill 비선택 배경) 신규 색 토큰 · 패딩 임의값과 `.62`/`.625` 근접 중복 정규화.
