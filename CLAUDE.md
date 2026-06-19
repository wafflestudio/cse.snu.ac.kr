# csereal-web-v2 작업 가이드 (에이전트용)

코드만 봐선 알 수 없는 것 — **결정의 이유·히스토리·컨벤션·재발 함정**만 적는다. 구현 상세(파일 목록·시그니처·명령어)는 코드/`package.json`/config에서 확인. 4부: **①아키텍처·환경 → ②라우팅·코드 컨벤션 → ③E2E 테스트 → ④Storybook·디자인 시스템.** 사람용 온보딩·스크립트·환경 표는 `README.md`.

> **상태:** RR7 → TanStack Start 마이그레이션 **완료(2026-06-15)**, Storybook + 디자인 시스템 감사 **완료(2026-06-16)**. E2E는 마이그레이션 전용이 아니라 **일반 회귀 안전망**.

**목차** — [1. 아키텍처·환경](#1-아키텍처--환경) · [2. 라우팅·코드 컨벤션](#2-라우팅--코드-컨벤션) · [3. E2E 테스트](#3-e2e-테스트) · [4. Storybook·디자인 시스템](#4-storybook--디자인-시스템)

---

# 1. 아키텍처 · 환경

```
브라우저 ──(localhost:3000만)──> server.ts (:3000, prod와 공유)
                                  ├─ /api/**  → hono proxy → 로컬 docker 백엔드 :8080 (API_PROXY_TARGET 설정 시)
                                  └─ 그 외     → TanStack Start SSR (프로덕션 빌드 dist/)
```

- **백엔드 = 로컬 docker 실서버**(`../csereal-server-main`, :8080). MySQL+Spring, mock-login은 `@Profile("!prod")` 실엔드포인트(진짜 JSESSIONID 세션). **로컬 전용이라 리셋·시드 자유 — staging·프로덕션 서버는 절대 건드리지 않는다.** Playwright가 자동 기동.
- **프론트 = 프로덕션 빌드**를 루트 `server.ts`(Hono)로 서빙. MSW/mock 안 씀. prod 컨테이너와 동일 서버(`pnpm start`).
  - **왜 server.ts가 필요한가:** TanStack Start 기본 빌드는 `dist/server/server.js`를 **Web fetch 핸들러**로 내놓는데 Node HTTP 서버는 `IncomingMessage`/`ServerResponse`라 **Node↔Web 다리가 필연**. Hono(+@hono/node-server)가 그 변환·정적서빙·`/api` 프록시를 맡는다. (Bun/Deno는 불필요하지만 우리는 Node self-host.)
  - **왜 prod 빌드(dev 아님):** 비주얼 회귀가 dev≠prod면 무의미하고, E2E 정석은 배포 산출물 검증. dev 콜드 컴파일 플레이키도 없음.
  - **왜 same-origin proxy:** 실서버 세션 쿠키(JSESSIONID)는 `Secure`라 브라우저 **cross-origin 요청에 안 실린다** → prod빌드를 :8080에 직접 쏘면 mutation 인증이 깨짐(302 OAuth). 브라우저는 :3000만 보고 `/api`를 서버사이드에서 :8080으로 프록시 → 세션 first-party 유지, CORS/CSP 무관 → **E2E용 앱 코드 수정 0.** `/api` 프록시는 `API_PROXY_TARGET` 설정 시에만(local/E2E); 배포는 프론트·백엔드 동일 도메인이라 절대 URL 직호출.

---

# 2. 라우팅 · 코드 컨벤션

마이그레이션에서 확립.

- **라우팅: file-based**(`app/routes/**` → 생성 `routeTree.gen.ts`). loader는 `createFileRoute`에 **인라인**(분리 wiring 안 씀). 컴포넌트는 `Route.useLoaderData()`/`useParams()`를 **직접 호출**(prop 주입 안 함) → params 자동 타입(그래서 `params.id`에 `!` 불필요).
- **로케일: optional path param `{-$locale}`** — `app/routes/{-$locale}/**`에 1벌만(`/about`=ko, `/en/about`=en). 비로케일 라우트(`admin`·`[.]internal`·`img`·`sitemap`)는 `{-$locale}` 밖. `__root` beforeLoad가 `/ko`→bare redirect + 쿠키(`lang`)·Accept-Language로 판정.
- **⚠️ 로케일 링크는 항상 `localizedPath()`. 수동 `/${locale}/...` 문자열 금지** — ko에서 `/ko/...`를 **클라 네비로 클릭**하면 `__root`의 `/ko`-strip redirect가 렌더 루프(메인스레드 peg)를 일으킨 실버그가 있었다(notice 상세 wedge). `localizedPath`는 ko에서 프리픽스 없는 경로를 만들어 그 라운드트립을 제거한다.
- **mutation은 대부분 클라 `fetch`**(same-origin proxy 경유). `action`은 거의 없음.
- **검색/페이지네이션은 공용 `app/hooks/useSearchParams.ts`**(URLSearchParams 기반). 여러 라우트가 Pagination·SearchBox·TagCheckboxes를 공유해 라우트별 타입(`Route.useSearch`/`validateSearch`)은 부적합 — 표준 URLSearchParams 훅이 맞다.
- **서버 라우트(Response 직접 반환):** `/img`(이미지 최적화 프록시 — sharp·AVIF·디스크캐시·SSRF 화이트리스트)와 `/sitemap.xml`. `/img`가 **시스템 유일의 이미지 최적화 계층**(백엔드는 원본만 서빙, `Image`가 렌더타임에 `/img?url=...` 생성, DB엔 원본 URL만). 장기적으론 백엔드/CDN(imgproxy) 이관 검토.
- **TanStack 함정(겪은 것):**
  - 같은 라우트 재진입 시 컴포넌트를 **재마운트 안 할 수 있음** → `useState(props)` 초기화 안 됨(TimelineViewer 연도선택 버그). URL/props 파생으로 처리.
  - 클라 네비 시 **loader가 클라에서 실행** → 합성 request엔 쿠키 없음. 인증 의존 loader는 `forwardAuthHeaders`로 서버 헤더 전달.
  - `getRequestHeaders()`는 **Headers 객체**(`.get()` 사용, 프로퍼티 접근 금지).
- **린트/포맷: Biome.** 커밋 전 `lint-staged`가 staged 파일에 `biome check --write --error-on-warnings`(+`typecheck`)를 돌려 **경고도 커밋을 막는다**. 전체 점검은 `pnpm lint`. 벤더드 CSS(suneditor·sonner)·생성물 `routeTree.gen.ts`는 `biome.json`에서 린트 제외. `!` 비널 단언·`any`는 경고라 회피.

## 디렉터리 · 파일 구조

- **라우트는 URL을 미러링**(`app/routes/{-$locale}/<path>`). 라우트별 비라우트 파일은 같은 폴더에 **co-locate**.
- **co-location 폴더명은 라우팅 ignore 패턴과 맞물린다.** `vite.config.ts`의 `routeFileIgnorePattern`이 `components`·`sections`·`use[A-Z]`·PascalCase·(`api`/`constants`/`fetchContent`)를 라우트에서 제외한다 → 비라우트 파일은 **`components/`(복수)·`hooks/`(`useX`)·`sections/`·`assets/`** 또는 PascalCase로 둔다. ⚠️ 단수 `component/`처럼 패턴에 안 맞는 이름은 **라우트로 샐 수 있다**(실제 outlier 1건 → 복수로 통일함). 새 co-location 폴더는 반드시 패턴에 맞는 이름으로.
- **공용 `app/components/`**: `ui`(제어 프리미티브, value/onChange) · `form`(RHF 어댑터, name+useFormContext) · `layout`(앱 셸: Header/Footer/Nav/PageLayout + 404 `NotFound`) · `feature`(도메인 위젯: auth/category/content/SearchBox/selection). **route-specific → co-locate, 여러 라우트서 재사용 → 여기로 승격.**
- **헬퍼는 `app/utils/` 한 곳**(과거 `lib/`와 분리했으나 경계가 모호하고 폴더가 아무것도 강제하지 않아 합침). **서버 전용 보장은 폴더가 아니라 `createServerFn`·서버 라우트 핸들러가 한다** — 무거운 서버 전용 deps(cheerio→`cspServerFn`/`processHtmlForCsp`, sharp→`imageOptimizer`)는 그 경계 안에서만 돌려 클라 번들에서 빠진다.

---

# 3. E2E 테스트

> 프론트가 **렌더/동작/픽셀 동일한가**를 지킨다(비주얼 회귀 포함).

## 범위 기준 — 단일 잣대

> **"마이그레이션이 이걸 깨뜨린다면, 깨진 코드는 프론트 레포에 있나?"** 예 → E2E. 아니오(백엔드) → 백엔드를 신뢰(테스트 추가 금지).

백엔드는 **고정된 실서버**라 그 소유 동작은 전후 불변 → E2E로 재면 비용(느림·flaky·stateful)만 들고 안전망 가치 없음.

| 프론트 소유 → **테스트함** | 백엔드 소유 → **신뢰** |
|---|---|
| 렌더(콘텐츠/레이아웃·스크린샷) | 역할 **인가 강제** |
| loader 와이어링(엔드포인트 fetch + 파싱 + 필드→UI 매핑) | 비즈니스 규칙(409, 날짜, 정기예약 LABMASTER-only) |
| action 와이어링(payload + 엔드포인트 + 토스트/리다이렉트/revalidate) | 서버 검증, 정렬/검색(FTS) 순서·랭킹 |
| 클라 상태/상호작용(드롭다운·탭·모달·캐러셀·언어토글) | 영속 의미(cascade·기본값·계산 필드) |
| 조건부 렌더/게이팅(`LoginVisible`, 핀/잠금 **아이콘 렌더**, isPrivate 플래그 전송) | 데이터 자체의 정확성·필터링 결과 |

**경계 함정(이 기준으로 걸러진 사례):**
- 게시설정: 프론트가 플래그를 **전송**하나(O, action 와이어링) ↔ 백엔드가 **정렬/필터**한 결과(X). 고정 검증은 `boundingBox` 순서(백)가 아니라 **핀 아이콘 렌더**(프론트)로.
- 역할 분기: 프론트가 역할별로 뭘 **렌더**하나(O) ↔ 백엔드가 뭘 **허용**하나(X). disallowed-로그인은 익명과 같은 false 브랜치라 read 스크린샷이 이미 커버.
- 통합 seam은 와이어링 모양당 1번("생성→목록에 뜸"). 모든 필드 정확 저장까진 안 캠(백엔드).

## 분류: read / flow

**`read` = 비로그인 AND DB 변경 없음 · `flow` = 로그인 필요 OR DB 변경.** 모든 케이스가 둘 중 하나(검색=read, admin=flow). 전 라우트가 `read.spec.ts`(데스크톱 `read` + 모바일 `read-mobile` 프로젝트가 같은 스펙 공유) + `flow.spec.ts` 구조다(smoke/visual 폐기). 구조·시더·헬퍼 위치는 `tests/` 디렉터리와 `tests/research/labs/`(reference 구현) 참고.

**read.spec.ts** — 비로그인이 도달 가능한 모든 화면. 핵심 콘텐츠 1~2개 assert + `toHaveScreenshot`(콘텐츠 계약 + 픽셀). **ko 전용**(en 읽기는 안 찍음 — 번역 텍스트만 바뀌어 가치 낮음).
- ⚠️ **콘텐츠 assert는 모바일에서도 보이는 요소로**: 한 스펙이 데/모바일 두 viewport를 도니 `hidden sm:*`(데스크톱 전용 SubNavbar·메가메뉴) 텍스트를 assert하면 모바일서 깨진다 → 양쪽 다 보이는 본문 PageTitle·콘텐츠를 고른다.
- **상세 레이아웃이 형제와 다르면 별도 스크린샷**(예: faculty 상세 vs emeritus/staff 상세는 컴포넌트 구성이 달라 각각 캡처).
- **상태는 URL 우선**(`?keyword=`·`?tag=`·`?pageNum=`·`?selected=`·`?selectedDate=`로 직접 이동); URL로 안 되는 클라 상태(드롭다운·탭·모달)는 read에서 클릭(비변경이면 OK).
- **여러 상태:** 레이아웃 다른 상태(모달·탭·펼침·빈 상태) → 각각 / 데이터만 다른 반복 → 대표 1장 / **빈 상태**(결과 없음·0개) → 가능한 곳 모두.

**flow.spec.ts** — 로그인(staff) 또는 DB 변경. 데스크톱만, read 의존. 한 파일에 `describe`로 'CRUD'/'게시 설정'/'일괄 관리' 구분.
- **이중언어 → en round-trip**: ko·en 입력 후 ko는 ko 상세, en은 `/en` 상세에서 값 노출 확인(쓰기 검증 — read에서 en 안 찍는 것과 별개). 안정적 `/:id` 상세는 `expectEnDetailHeading` 사용. 공통 `$type/edit` 형제(history/contact/overview)는 greetings로 대표.
- 게시설정·토글(비공개·고정·태그·첨부·이미지)은 **대표 타입(notice)만**, 나머지는 동일 백엔드 메커니즘이라 주석으로 생략 명시.
- **로그인만 필요한 읽기**(admin 메뉴, staff 전용 예약실)도 flow에(visual 안 만듦).
- 게시설정 **시각**은 일반 사용자가 보는 것만 baseline에 심어 read로 캡처(고정 핀·메인 슬라이드). **비공개(잠금)은 staff 전용이라 시각 검증 안 함**, flow 동작(숨김)만.

## 결정론

- `globalSetup`이 매 런 **DB 리셋 → SQL 시드 → API 시드 → 날짜 정규화**. 빈 DB라 auto-increment id 고정. read 스펙은 baseline만 검증(도메인 `*_SEED` 상수를 기대값 단일 출처로 import). **flow 스펙은 baseline 안 건드리고 자기 항목만** 생성/편집/삭제(`Date.now()` 고유 이름).
- **날짜:** payload 날짜는 고정값. **서버가 박는 created_at/modifiedAt이 화면에 노출되면**(notice·메인 NewsCard·conference_page) `normalize-dates.sh`가 globalSetup에서 고정값으로 정규화 — 새 게시물 테이블 추가 시 UPDATE 한 줄 추가. **마스킹보다 정규화 우선**(시:분 글자폭이 마스크 박스를 흔들어 불안정).
- **마스킹**은 정규화 불가한 비결정만 — 외부 SDK(KakaoMap), 백엔드 비정렬 컬렉션(groups 상세 labs Set). 상대시간 렌더 시 `page.clock`(현재 해당 없음).

## flow = stateful(실서버 영속성)

실서버라 "내가 만든 게 실제로 보이는가"를 추가→편집→삭제 전체로 직접 검증한다.

## 로그인(prod 형태)

`loginAsStaff`는 dev STAFF 버튼을 안 누른다(prod 빌드엔 없음). mock-login으로 세션 쿠키 발급 + reload → my-role이 세션 읽어 staff UI 렌더(프로덕션과 동일 화면).

## Form / 대기

- suneditor 사용(에디터 `.sun-editor-editable`, 한/영 전환은 `label[for="ko"|"en"]` 클릭). **Form 구동은 `tests/helpers/forms.ts` 단일 책임 함수로 — 인라인 재구현 금지.** 모든 CRUD 삭제는 `deleteItem` 경유(확인 버튼 라벨이 컴포넌트마다 달라 `confirmText`로 지정; Form.Action='확인', 게시글='삭제').
- 네비게이션은 `waitForURL`(명시적 URL 확인 우선). 에디터 언어 전환은 라디오 checked 대기. **`waitForTimeout` 금지 — 조건 대기로.** 나머지는 Playwright auto-waiting.

## 실행 / baseline

- **모든 테스트는 핀된 Playwright 컨테이너에서 돈다**(`pnpm test` = `scripts/e2e-docker.sh`). 호스트 직접 실행 정식 경로 없음 — 렌더 환경을 컨테이너로 고정해야 baseline이 머신 무관하게 픽셀 동일. **솔로 레포라 (GitHub) CI 없음 — 로컬 `pnpm test`가 단일 게이트.** (컨테이너 런은 `CI=1`로 워커1·retries2 모드 선택.)
- **비주얼 baseline = Linux 단일(`*-linux.png`)**, 컨테이너가 정본 렌더 환경이라 머신 무관.
- **백엔드 기준 = `../csereal-server-main`(origin/main)** — baseline은 이 main 백엔드에서 찍고, E2E가 main 백엔드 스모크도 겸한다. 트레이드오프: main이 floating이라 **백엔드만 바뀌어도 baseline이 깨질 수 있음** → 백엔드를 최신 main으로 올리고(아래) `--update-snapshots`로 재생성.

## 백엔드 버전 동기화(cross-repo 런북)

docker가 **소스의 prebuilt JAR를 COPY**하므로 `../csereal-server-main` 소스가 낡으면 docker도 낡는다. 뒤처졌으면:
```bash
cd ../csereal-server-main && git fetch origin && git merge --ff-only origin/main
docker run --rm -v "$PWD":/app -v csereal-gradle-cache:/root/.gradle -w /app \
  eclipse-temurin:21-jdk ./gradlew bootJar -x test               # 호스트 JDK 11이라 Java21 컨테이너로 빌드
cd ../cse.snu.ac.kr && docker compose -f ../csereal-server-main/docker-compose-local-full.yml \
  -f tests/setup/backend/docker-compose-fe-test.yml up -d --build  # 새 JAR로 이미지 재빌드
```
올린 뒤 `pnpm test --update-snapshots`로 baseline 재생성. (v3 등 다른 작업본은 형제 `../csereal-server`에.)

## 새 라우트 추가 / 확장

진행 상태·커버리지는 **`tests/COVERAGE.md`가 단일 출처**(라우트 끝낼 때마다 갱신). reference 구현 `tests/research/labs/` + `tests/setup/seed/research.ts`를 본뜬다.
- **시드는 API 우선**: 생성 API가 있으면 `tests/setup/seed/<domain>.ts`에 `<DOMAIN>_SEED` + 시더 만들고 `seed/index.ts`에 등록. **SQL은 예외** — 생성 API가 없는 content 싱글톤(PUT만 있고 POST 없어 빈 DB 500)만 `seed-content.sh`에 INSERT. **API로 되면 절대 SQL 안 씀.**
- 도메인별 시드 모듈 + 중앙 조합(`seed/index.ts`), cross-domain 참조는 앞 시더 반환 id를 명시적으로 전달. 표시 문자열은 `*_SEED`에만(단일 출처).
- **복합 페이지는 편집 기능마다 별도 flow**(탭/섹션/테이블 인라인 편집 놓치기 쉬움). **POM 미사용** — 함수형 헬퍼 유지.
- 자율 진행 시 **묻지 말고 진행**하되 라우트마다 `COVERAGE.md` 갱신(컨텍스트 끊겨도 이어지게). 실서버가 실버그를 잡으면 **증상 우회 말고 원인을 시스템 차원에서** 고치고 기록.

## 발견된 실버그(참고)

E2E가 실제 버그를 잡는다. 예: DELETE가 200 빈 본문을 반환하는데 `fetchJson`이 빈 본문을 파싱하다 throw → "삭제 성공인데 실패 토스트". → `fetchJson`을 빈 본문 시 undefined 반환하도록 **root-cause 수정**(22개 DELETE 사이트 일괄). 증상이 아니라 원인을 고친다.

---

# 4. Storybook · 디자인 시스템

- **설정:** SB 10.4 `@storybook/tanstack-react`(라우터 컨텍스트 내장), 스토리 컴포넌트 코로케이션. Chromatic 제거(픽셀 회귀는 E2E 담당). 스토리 빌드 회귀는 CI가 없어 로컬 `build-storybook`/배포 빌드에서만 드러남.
- **포맷: CSF Next(CSF Factories)** — `preview.meta(...)` → `meta.story(...)`. default export·`satisfies Meta` 안 씀. 핸들러는 `storybook/test`의 `fn()`(단 `useArgs`/`useState`로 덮이면 noop). a11y는 `test:'todo'`(수동).
- **배포:** Dockerfile이 `storybook-static`을 이미지에 포함 → `server.ts`가 **`/storybook`**으로 서빙(prod·staging). 에셋 상대경로라 서브패스 OK(앱 `/assets`와 안 섞임).
- **함정(재발 주의):**
  - **addon-vitest 설치 금지** — `playwright@1.60`을 끌어와 앱 E2E `@playwright/test@1.57`와 충돌. 그래서 `sb.mock` 대신 **Vite alias**로 `@/lib/serverFns`를 no-op로 대체(useLanguage의 `createServerFn` `.validator`가 SB 브라우저서 throw → 빈 렌더 회피).
  - **viewport는 SB10 코어 내장** — 별도 애드온 없이 `parameters.viewport.options` + `globals.viewport`.
  - **union 필수 prop은 스토리에 args 명시** — string-literal union 필수 prop이 하나라도 있으면 CSF4가 `meta.args`만으론 "충족"을 인식 못 해 `children` 포함 필수 args 전체를 각 스토리에서 재요구. discriminated-union 합성 render는 무인자로 둬 추론 회피. typed parameters라 `docs.story.iframeHeight`는 **string**.
  - **모달/오버레이는 `open` 강제 대신 트리거+`play`** — `open:true`로 열어두면 portal 오버레이가 Docs 전체를 덮어 `inline:false`(독립 iframe)를 강요하는데 **그 iframe은 컨트롤 라이브 업데이트를 못 받는다**(실제 버그). 닫힌 채 렌더(트리거+`useState`) + `play`로 연다 — `play`는 canvas만 자동 실행(Docs 기본 미실행)이라 Docs는 컨트롤 정상·canvas는 자동으로 열림. controlled 모달은 `useState`로, 마운트형(ImageModal)은 `key`로 재마운트, 클릭 트리거 있는 것(Dropdown·DatePicker)은 `play`로 누르고 `inline:false`만 제거.
- **현황:** 전 공용 컴포넌트가 스토리 **또는 제외 사유** 보유. 제외: `Form`·`html/HTMLEditor`·`CategoryPage`·`PageLayout`(합성/외부 의존), `LoginVisible`(역할 게이팅 로직, 자체 시각 없음 — 가짜 placeholder 필요해 '실사용만' 위반), `ContentSection`(레이아웃 래퍼), `NotFound`(Header+ErrorState 합성, 둘 다 개별 스토리 있음). 모두 E2E가 실동작 커버.
- **폼 스토리:** `withForm` 데코가 `parameters.formValues`로 `defaultValues` 주입(DatePicker=Date·File=배열 등 값 shape 가정 컴포넌트는 필수). Radio·Checkbox는 같은 `name` 공유 그룹으로(실사용). `Image`는 `/img`(SB에 없음) 회피 위해 data-URI.
- **스토리 작성 원칙(사용자 지시):**
  1. **실사용 조합만.** 서비스에서 안 쓰는 variant/state를 창조하지 않는다(사용처 grep 확인).
  2. **DS에 우겨넣지 않는다.** 일관성 깨지는 사용처는 비주얼이 깨지더라도 **앱 코드를 고친다**(컴포넌트 API 확장 X). 이렇게 잡은 실버그: Tag 삭제버튼 `aria-label`→`ariaLabel`.
  3. **편집 불가 prop은 컨트롤에 욱여넣지 않는다.** 함수/복합 union·ReactNode는 `control:false`로 숨기고 상태는 별도 스토리/`mapping`으로. ↔ **제어 컴포넌트 value/onChange는 `useArgs`로 묶어** 컨트롤이 실제로 먹게(로컬 `useState`면 컨트롤 무시 — Calendar·AlertDialog에서 겪음).
- **디자인 토큰:** `app/app.css`의 `@theme`. **가로 페이지 거터는 `.page-gutter-x` 단일 출처**(좌 100/우 360/모바일 20px). 토큰화/스케일화는 **픽셀 동일할 때만 자율**; 값이 바뀌는 정규화는 디자인 결정 → 합의.
- **API 레이어 분리:** `ui/*`=제어 프리미티브(value/onChange), `form/*`=RHF 어댑터(name+useFormContext). **의도된 분리 — 통합 금지.**
- **단일 선택은 Button 토글이 아니라 네이티브 radiogroup**(`fieldset`+`radio` pill) — 그룹 시맨틱·화살표 키 이동을 브라우저가 준다(faculty 정렬·공지 필터). 그 결과 Button `variant`(과거 `kind`서 개명 — Tag와 통일)는 상태 없는 5개(primary/neutral/secondary/quiet/nav). **아이콘은 children에 직접**(shadcn식, base `gap-2`가 간격).
- **a11y:** form Radio/Checkbox=네이티브, Dialog/AlertDialog/Select/ImageModal=Radix(ARIA 자동). Button **icon-only는 `ariaLabel` 필수.**
- **합의 대기(자율 실행 금지):** ① `#202020`(공지 필터 pill 비선택 배경) 신규 색 토큰 — 매칭 토큰 없어 디자인 결정. ② 패딩 세로/내부 임의값 + `.62`/`.625` 근접중복 정규화(가로 거터는 완료).

---

**마지막 업데이트:** 2026-06-19 (① **문서 슬림화**: 코드·config에서 확인되는 구현 상세(명령어 덤프·코드 예제·파일/함수 열거)를 제거하고 결정 이유·히스토리·컨벤션·함정만 유지. ② **폴더 구조 컨벤션 문서화**(§2 "디렉터리·파일 구조": co-location 명명 ↔ `routeFileIgnorePattern` 연결, components 택소노미, lib/utils 의도) + `system/`(NotFound 1개) → `layout/`로 폴딩. ③ **Biome 강화**: 벤더드 CSS·생성물 린트 제외, 전 레포 경고 0 정리, `--error-on-warnings` 게이트 + `pnpm lint`. ④ 코드 컨벤션: faculty/create 수동 로케일→`localizedPath`, research/labs `component/`→`components/`. 이전: 4부 재편, CI 제거·main 백엔드·Linux baseline, Storybook CSF Next, 2026-06-16 마이그레이션·디자인 시스템 완료.)
