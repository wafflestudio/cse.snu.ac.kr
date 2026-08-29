# csereal-web-v2 작업 가이드 (에이전트용)

코드만 봐선 알 수 없는 것 — **결정의 이유·히스토리·컨벤션·재발 함정**만 적는다. 구현 상세(파일 목록·시그니처·명령어)는 코드/`package.json`/config에서 확인. 4부: **①아키텍처·환경 → ②라우팅·코드 컨벤션 → ③E2E 테스트 → ④디자인 시스템.** 사람용 온보딩·스크립트·환경 표는 `README.md`.

> **상태:** RR7 → TanStack Start 마이그레이션 **완료(2026-06-15)**, Storybook + 디자인 시스템 감사 **완료(2026-06-16)**. E2E는 마이그레이션 전용이 아니라 **일반 회귀 안전망**.

**목차** — [1. 아키텍처·환경](#1-아키텍처--환경) · [2. 라우팅·코드 컨벤션](#2-라우팅--코드-컨벤션) · [3. E2E 테스트](#3-e2e-테스트) · [4. 디자인 시스템](#4-디자인-시스템)

---

# 1. 아키텍처 · 환경

```
브라우저 ──(localhost:3000만)──> server.ts (:3000, prod와 공유)
                                  ├─ /api/**  → hono proxy → 로컬 docker 백엔드 :8080 (API_PROXY_TARGET 설정 시)
                                  └─ 그 외     → TanStack Start SSR (프로덕션 빌드 dist/)
```

- **백엔드 = 로컬 docker 실서버**(`../csereal-server`, :8080). MySQL+Spring, mock-login은 `@Profile("!prod")` 실엔드포인트(진짜 JSESSIONID 세션). **로컬 전용이라 리셋·시드 자유 — staging·프로덕션 서버는 절대 건드리지 않는다.** `pnpm test` 시 루트 `compose.yml`이 자동 기동(기동 순서·health 대기를 compose 선언으로 보장 — playwright.config는 앱만 띄운다).
- **프론트 = 프로덕션 빌드**를 루트 `server.ts`(Hono)로 서빙. MSW/mock 안 씀. prod 컨테이너와 동일 서버(`pnpm start`).
  - **왜 server.ts가 필요한가:** TanStack Start 기본 빌드는 `dist/server/server.js`를 **Web fetch 핸들러**로 내놓는데 Node HTTP 서버는 `IncomingMessage`/`ServerResponse`라 **Node↔Web 다리가 필연**. Hono(+@hono/node-server)가 그 변환·정적서빙·`/api` 프록시를 맡는다. (Bun/Deno는 불필요하지만 우리는 Node self-host.)
  - **왜 prod 빌드(dev 아님):** 비주얼 회귀가 dev≠prod면 무의미하고, E2E 정석은 배포 산출물 검증. dev 콜드 컴파일 플레이키도 없음.
  - **왜 same-origin proxy:** 실서버 세션 쿠키(JSESSIONID)는 `Secure`라 브라우저 **cross-origin 요청에 안 실린다** → prod빌드를 :8080에 직접 쏘면 mutation 인증이 깨짐(302 OAuth). 브라우저는 :3000만 보고 `/api`를 서버사이드에서 :8080으로 프록시 → 세션 first-party 유지, CORS/CSP 무관 → **E2E용 앱 코드 수정 0.** `/api` 프록시는 `API_PROXY_TARGET` 설정 시에만(local/E2E); 배포는 프론트·백엔드 동일 도메인이라 절대 URL 직호출.

## prod 토폴로지 (호스트 `csereal-prod`)

```
인터넷 ─443─> Caddy(엣지: TLS·HSTS·HTTP/2·라우팅)
              ├─ 그 외        → :3000  frontend(Hono 컨테이너, gzip 압축)
              └─ /api/*       → :8080  backend(GHCR 이미지)
                        ↑
   frontend SSR이 백엔드를 부를 때도 이 엣지를 탄다(절대 URL 직호출).
   컨테이너의 `--add-host cse.snu.ac.kr:host-gateway`가 그 경로를 만든다.
```
- 엣지 = **Caddy 컨테이너**(`~/proxy/caddy/Caddyfile`, 이 레포 밖). TLS·라우팅·보안 헤더(`-Server`·`X-XSS-Protection`) 담당.
- 백엔드는 `ghcr.io/wafflestudio/csereal-server`(CI 빌드→GHCR→pull). **프론트는 호스트 빌드**(레지스트리 없음 — 호스트가 git URL로 `docker build`, 아래).
- **⚠️ 압축은 이제 앱이 한다(`hono/compress`).** 예전엔 Caddy 위 상위 계층(바쿠스 프록시)이 br 압축을 해줘서 이 레포는 압축을 안 넣었는데, **2026-08 프록시 제거로 그 계층이 사라졌다**(실측: prod가 HTML을 무압축 94KB로 서빙). `immutable` 캐시 헤더는 앱이 원래부터 내고 있어 무관.

## prod 네트워크 상태 (2026-08-29 갱신 — 도메인 연결·cutover 완료)

- prod IP = **147.46.92.120**(구 프록시 경유 → 공인 IP 직결). `env/.env`의 `CSEREAL_PROD_SSH_HOST` 갱신 완료(옛 `waiter.bacchus.io`→147.46.92.174에서 이전). 포트 9122·키 동일.
- **도메인 연결 완료** — `cse.snu.ac.kr` DNS 해석(→147.46.92.120)·443 학외 개방·마이그레이션 빌드 라이브를 실측 확인(2026-08-29). 한때 리셋됐던 웹 포트 개방 승인도 재개방됨. cutover 자체는 아래 활성화 블록 참고.
  - 학외 접속이 드물게 실패할 수 있다 — 재시도하면 붙는다(앱 버그 아님, 하드 차단 아님).
- **⚠️ 학외 OAuth 로그인은 아직 불가.** OAuth는 사용자 브라우저가 `id.snucse.org`(→147.46.92.174)에 직접 붙어야 하는데 그 호스트가 학외 443을 막고 있다(2026-08-29 실측 4/4 timeout — SYN drop과 달리 재시도로도 안 붙는 하드 차단). **바쿠스가 그 호스트를 학외 개방해야 학외 로그인이 동작한다**(앱 문제 아님, 바쿠스 소유). 학내에선 정상.
- **E2E OIDC 부팅 의존(해결됨, 영구).** 백엔드가 기동 시 `id.snucse.org` OIDC discovery를 하다 타임아웃으로 크래시 루프(실측 RestartCount 28, CI e2e 잡도 동일 원인 실패)던 것을, 루트 `compose.yml`의 oidc-stub(nginx, 인라인 config)이 discovery 문서만 응답해 끊었다 → 학내/학외 무관하게 돈다. local 프로파일도 issuer-uri를 등록해 부팅 시 discovery가 강제되는 게 원인 — **근본 해결 = 백엔드 local 프로파일에서 OIDC 등록 제거(업스트림 PR 대상)**, 머지되면 stub 삭제 가능.
- **⚠️ 컨테이너에 `--add-host cse.snu.ac.kr:host-gateway`가 필요하다(`remote-deploy.sh`가 붙인다, 롤백 명령에도).** prod 빌드는 API_PROXY_TARGET 없이 **절대 URL 직호출**이라 SSR이 `https://cse.snu.ac.kr/api/...`를 부르는데 컨테이너가 그 호스트명을 자기 게이트웨이로 풀어야 한다. 빠지면 **전 페이지 500**(getaddrinfo 실패) — 오래 떠 있는 컨테이너에선 안 드러나다가 **재생성 시점에 터진다**(2026-08-22에 겪음).
- **⚠️ `@backend_denied` IP 직결 우회 = 실제 열린 갭(2026-08-29 확인, 미조치).** Caddyfile이 관리 엔드포인트 3개(`/api/v1/search/refresh`·`/api/v2/reservation/terms/custom`·`/api/v2/reservation/terms/defaults`)를 `not remote_ip {$LOCAL_IP}`로 막는데 **그 deny가 도메인 블록에만 있고 `147.46.92.120` IP 직결 블록엔 없다** → 학외에서 `https://147.46.92.120/api/...`로 치면 통과(도메인으로는 000 abort). 게다가 `LOCAL_IP=10.91.1.1`은 **구 프록시 사설 주소**라 직결 전환 후 정상 관리자도 통과 못 시킨다. **조치 = IP 직결 블록에도 같은 `abort @backend_denied` 추가 + `LOCAL_IP`를 직결 토폴로지 기준으로 재정의**(`~/proxy/caddy/Caddyfile`, 이 레포 밖).

## 브랜치 · CI/CD 컨벤션

- **브랜치:** `main`=production · `develop`=staging · `feature/*`·`fix/*`→`develop` PR · `hotfix/*`→`main` PR(후 develop back-merge). **직접 push 금지** — ruleset이 main·develop에 PR 필수 + `gate`·`e2e` 필수체크 + force push 금지 강제(admin 포함).
- **머지 전략:** `feature`→`develop`은 **squash**(WIP 커밋 정리, 기능당 1커밋). `develop`→`main`은 **merge commit**(squash ❌ — develop은 long-lived라 squash하면 main과 히스토리가 갈라져 다음 승격 PR이 깨짐). rebase 머지는 끔, 머지 후 head 브랜치 자동삭제. (레포 설정으로 강제.)
- **CI(`.github/workflows/ci.yml`, PR 시):** ① 게이트(`typecheck`/`lint`/`knip`/`build:local`, ~1–2분; `knip`=미사용 파일·export·의존성) ② E2E(로컬과 동일 `e2e-docker.sh`; CI는 프론트를 서브디렉터리·백엔드를 핀된 `BACKEND_REF` **소스**로 체크아웃 후 `gradlew bootJar`로 JAR 빌드(Dockerfile이 build/libs를 COPY)하는 것만 다름 — GHCR `:prod`는 prod 프로파일이라 mock-login이 꺼져 못 씀). **두 벌 관리 X — CI는 같은 스크립트·config 호출만.**
- **CD(`deploy.yml`, `develop` push):** deploy.yml이 staging 호스트에 SSH로 `remote-deploy.sh`를 보내 **호스트에서 빌드+교체**를 트리거한다. `main` push는 자동 배포 없음 — prod는 `deploy.sh prod`로 **수동**(같은 호스트 빌드 흐름). **레지스트리(GHCR) 없음 — 빌드==배포**, 호스트가 자기 arch로 네이티브 빌드. CI(ci.yml)는 게이트만, 배포 이미지는 안 만든다. 문서만(`**.md`) push는 `paths-ignore`로 스킵.
- **호스트 빌드 흐름**(`remote-deploy.sh`, 호스트에서 실행): **`docker build "<git-url>#<REF>"`** — docker가 소스를 직접 클론해 빌드 컨텍스트로 쓴다 → **호스트엔 docker만 있으면 된다**(레포 체크아웃·env 파일 불필요). **빌드 성공 후에만** 컨테이너 교체(빌드 중엔 구버전 서빙 → 무중단). 카맵키는 `--build-arg VITE_KAKAO_MAP_API_KEY`(git 밖 시크릿). **롤백 = machinery 없이 이전 커밋 sha로 다시 빌드**: `deploy.sh <env> <sha>`(빌드가 빠르니 재빌드가 곧 롤백). `deploy.sh`는 로컬 `env/.env`에서, `deploy.yml`은 `KAKAO_MAP_KEY` 시크릿에서 카맵키를 받아 넘긴다.
- **왜 호스트 빌드(학외 CI 아님):** ① 빌드가 곧 배포라 레지스트리 분리가 무의미 ② **프리렌더 대비** — 프리렌더는 빌드타임에 페이지마다 백엔드를 부르는데 prod API(`cse.snu.ac.kr`)는 경계 뒤라 학외 CI 빌드는 SYN drop이 **페이지 수만큼 누적**돼 플레이키. **학내 호스트 빌드면 안정적으로 닿는다.** (RR7도 같은 이유로 호스트 빌드였다 → 마이그레이션에서 prerender가 빠져 한때 CI 빌드 → 프리렌더 재도입을 위해 호스트 빌드로 통일.) 트레이드오프: 서빙 호스트에 빌드 부하가 생기나 `docker build`는 격리·무중단 swap이라 감내. `imageOptimizer`의 "prerender hack" 주석은 프리렌더 재도입 시 다시 검토.

> **활성화 상태(2026-08-29 갱신):** ✅ **secret 2개**(`STAGING_SSH_KEY` + `KAKAO_MAP_KEY` — CI 빌드가 카맵키를 build-arg로 주입). host/user/port·API URL은 코드에 두어 시크릿에서 뺐다. 옛 `ENV_FILE_*`·`STAGING_SSH_HOST/USER/PORT`는 **삭제 대상**. · `develop` push 시 staging 호스트 빌드 자동배포 · **branch protection(ruleset: `main`·`develop` PR필수 + 필수 체크 `gate`·`e2e`, bypass 권한자 없음)** · `BACKEND_REF` 핀(#399 SHA 1661f3d8) · ci.yml · deploy.yml.
>
> **prod cutover 완료(2026-08-29 확인).** 마이그레이션 빌드가 라이브다 — strict CSP(요청마다 nonce 회전)·gzip(`hono/compress`)·wscan 경로 404·`/admin` 익명 404를 실측(전부 마이그레이션+wscan 대응 이후에만 존재하는 특징). (당시엔 GHCR pull 배포였고 `/storybook`도 서빙됐으나 이후 **호스트 빌드**로 전환 + Storybook 배포 제거 — 위 CD 참고.)
>
> ⚠️ **"설정이 없다"는 결론을 API 404로 내리지 말 것**(이번 작업에서 두 번 틀렸다). 브랜치 보호는 `repos/:owner/:repo/rules/branches/:branch`(ruleset)로 조회한다 — 구식 `branches/:branch/protection`은 ruleset만 쓰는 레포에서 404를 반환한다. GHCR 패키지는 **조직 소유**(`orgs/wafflestudio/packages/...`)로 조회한다 — 개인 엔드포인트(`user/packages/...`)는 404, 조직도 토큰에 `read:packages`가 없으면 403이다. (이 문서의 이 항목이 이미 정답을 담고 있었다 — 낡은 브랜치의 사본을 보고 판단하지 말 것.)

---

# 2. 라우팅 · 코드 컨벤션

마이그레이션에서 확립.

- **라우팅: file-based**(`src/routes/**` → 생성 `routeTree.gen.ts`). loader는 `createFileRoute`에 **인라인**(분리 wiring 안 씀). 컴포넌트는 `Route.useLoaderData()`/`useParams()`를 **직접 호출**(prop 주입 안 함) → params 자동 타입(그래서 `params.id`에 `!` 불필요).
- **로케일: required path param `$locale`** — `src/routes/$locale/**`에 1벌만(`/ko/about`·`/en/about`). **모든 페이지가 프리픽스를 가진다**(2026-06-21 전환, 이전엔 optional `{-$locale}`이었다). 비로케일 라우트(`admin`·`[.]internal`·`img`·`sitemap`)는 `$locale` 밖. `__root` beforeLoad가 프리픽스 없는 경로를 쿠키(`lang`)·Accept-Language로 판정해 `/{lang}`으로 302.
- **⚠️ 로케일 링크는 항상 `localizedPath()`. 수동 `/${locale}/...` 문자열 금지** — ko에서 `/ko/...`를 **클라 네비로 클릭**하면 `__root`의 `/ko`-strip redirect가 렌더 루프(메인스레드 peg)를 일으킨 실버그가 있었다(notice 상세 wedge). `localizedPath`는 ko에서 프리픽스 없는 경로를 만들어 그 라운드트립을 제거한다.
- **mutation은 대부분 클라 `fetch`**(same-origin proxy 경유). `action`은 거의 없음.
- **검색/페이지네이션은 공용 `src/hooks/useSearchParams.ts`**(URLSearchParams 기반). 여러 라우트가 Pagination·SearchBox·TagCheckboxes를 공유해 라우트별 타입(`Route.useSearch`/`validateSearch`)은 부적합 — 표준 URLSearchParams 훅이 맞다.
- **서버 라우트(Response 직접 반환):** `/img`(이미지 최적화 프록시 — sharp·AVIF·디스크캐시·SSRF 화이트리스트)와 `/sitemap.xml`. `/img`가 **시스템 유일의 이미지 최적화 계층**(백엔드는 원본만 서빙, `Image`가 렌더타임에 `/img?url=...` 생성, DB엔 원본 URL만). 장기적으론 백엔드/CDN(imgproxy) 이관 검토.
- **⚠️ 검색 파라미터를 읽는 loader는 `loaderDeps: searchLoaderDeps`(`src/utils/loaderDeps.ts`) 필수.** match id가 `routeId+경로+JSON(loaderDeps)`라 선언이 없으면 **검색 파라미터만 바뀌는 클라 네비에서 loader가 아예 재실행되지 않는다**(RR7은 매 네비마다 실행 → 마이그레이션 때 조용히 깨진 채 넘어옴). 증상: URL만 바뀌고 화면 그대로 — 예약 캘린더 날짜 이동·목록 페이지네이션·태그 필터·검색이 전부 해당됐다(2026-07-29 수정, 13개 라우트). 누락은 **E2E 클릭 테스트**로 잡는다 — 검색 파라미터를 바꾸는 컨트롤을 도메인당 1개 클릭으로 검증(reservations 날짜·notice 페이지네이션이 reference, §3). 새 검색 파라미터 라우트엔 그 클릭 테스트를 반드시 추가할 것.
- **TanStack 함정(겪은 것):**
  - 같은 라우트 재진입 시 컴포넌트를 **재마운트 안 할 수 있음** → `useState(props)` 초기화 안 됨(TimelineViewer 연도선택 버그). URL/props 파생으로 처리.
  - 클라 네비 시 **loader가 클라에서 실행** → 합성 request엔 쿠키 없음. 인증 의존 loader는 `forwardAuthHeaders`로 서버 헤더 전달.
  - `getRequestHeaders()`는 **Headers 객체**(`.get()` 사용, 프로퍼티 접근 금지).
- **린트/포맷: Biome.** 커밋 전 `lint-staged`가 staged 파일에 `biome check --write --error-on-warnings`(+`typecheck`)를 돌려 **경고도 커밋을 막는다**. 전체 점검은 `pnpm lint`. 벤더드 CSS(suneditor·sonner)·생성물 `routeTree.gen.ts`는 `biome.json`에서 린트 제외. `!` 비널 단언·`any`는 경고라 회피.

## 디렉터리 · 파일 구조

- **라우트는 URL을 미러링**(`src/routes/$locale/<path>`). 라우트별 비라우트 파일은 같은 폴더에 **co-locate**.
- **co-location은 프레임워크 표준 `-` 프리픽스로 제외한다.** TanStack Router 기본값 `routeFileIgnorePrefix='-'` — `-`로 시작하는 파일/폴더는 라우트 생성에서 자동 제외된다. 그래서 비라우트 파일은 **`-components/`·`-hooks/`·`-api.ts`·`-constants.ts`·`-fetchContent.ts`**처럼 `-`로 시작하는 이름에 둔다(하위 `news/`·`sections/`·`ui/`·`assets/` 등은 부모가 `-`면 따라 제외되니 각각 프리픽스 불필요). `vite.config.ts`에 **커스텀 `routeFileIgnorePattern`은 두지 않는다**(2026-08 제거). ✅ 이름 규칙(복수/단수·PascalCase)과 무관하게 오직 `-` 프리픽스만 보므로, 과거 단수 `component/`가 라우트로 새던 함정이 원천적으로 사라졌다. 새 co-location 폴더/파일은 `-`로 시작하기만 하면 된다.
- **공용 `src/components/`**: `ui`(제어 프리미티브, value/onChange) · `form`(폼 전용 위젯 — `FormProvider` 전제, 대부분 `Form.*` compound의 내부 부품) · `layout`(앱 셸: Header/Footer/Nav/PageLayout + 404 `NotFound`) · `feature`(도메인 위젯: auth/category/SearchBox/selection). **route-specific → co-locate, 여러 라우트서 재사용 → 여기로 승격.** 예외: DS 프리미티브는 사용처 1곳이어도 `ui/` 유지(Dropdown·ImageModal이 해당).
- **헬퍼는 `src/utils/` 한 곳**(과거 `lib/`와 분리했으나 경계가 모호하고 폴더가 아무것도 강제하지 않아 합침). **서버 전용 보장은 폴더가 아니라 `createServerFn`·서버 라우트 핸들러가 한다** — 무거운 서버 전용 deps(cheerio→`processHtmlForCsp`(serverFn), sharp→`imageOptimizer`)는 그 경계 안에서만 돌려 클라 번들에서 빠진다.

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

라우트별 스펙 외에 **크로스커팅 스펙**이 둘 있다. 라우트마다 반복하지 않고 **와이어링 모양당 1번**만 검증하며, 각각 전용 프로젝트로 read 단계에서 병렬 실행되고 `flow`의 선행이다.
- `tests/language.spec.ts`(`language` 프로젝트) — 로케일 리다이렉트·우선순위·토글·hreflang.
- `tests/security.spec.ts`(`security` 프로젝트) — **상태 코드와 보안 헤더**. 렌더만 보는 read 스펙은 "화면은 맞는데 HTTP 응답이 틀린" 상태를 통과시킨다(2026-08 교내 취약점 점검에서 없는 경로가 200을 반환하던 것이 그렇게 오래 남아 있었다). DB에 의존하지 않아 baseURL만 바꾸면 staging·prod 실환경에도 쏠 수 있다.

**read.spec.ts** — 비로그인이 도달 가능한 모든 화면. 핵심 콘텐츠 1~2개 assert + `toHaveScreenshot`(콘텐츠 계약 + 픽셀). **ko 전용**(en 읽기는 안 찍음 — 번역 텍스트만 바뀌어 가치 낮음).
- ⚠️ **콘텐츠 assert는 모바일에서도 보이는 요소로**: 한 스펙이 데/모바일 두 viewport를 도니 `hidden sm:*`(데스크톱 전용 SubNavbar·메가메뉴) 텍스트를 assert하면 모바일서 깨진다 → 양쪽 다 보이는 본문 PageTitle·콘텐츠를 고른다.
- **상세 레이아웃이 형제와 다르면 별도 스크린샷**(예: faculty 상세 vs emeritus/staff 상세는 컴포넌트 구성이 달라 각각 캡처).
- **상태는 URL 우선**(`?keyword=`·`?tag=`·`?pageNum=`·`?selected=`·`?selectedDate=`로 직접 이동); URL로 안 되는 클라 상태(드롭다운·탭·모달)는 read에서 클릭(비변경이면 OK).
  - ⚠️ **단, URL goto는 전체 문서 로드(SSR)라 클라 네비게이션 경로를 안 탄다** — 그래서 loader 재실행이 깨진 버그(위 `loaderDeps`)를 못 잡았다. 검색 파라미터를 **바꾸는 컨트롤**(페이지네이션·필터·날짜 이동)은 도메인당 1개는 **클릭**으로 검증한다(reservations/room read 스펙이 reference).
- **여러 상태:** 레이아웃 다른 상태(모달·탭·펼침·빈 상태) → 각각 / 데이터만 다른 반복 → 대표 1장 / **빈 상태**(결과 없음·0개) → 가능한 곳 모두.

**flow.spec.ts** — 로그인(staff) 또는 DB 변경. 데스크톱만, read 의존. 한 파일에 `describe`로 'CRUD'/'게시 설정'/'일괄 관리' 구분.
- **이중언어 → en round-trip**: ko·en 입력 후 ko는 ko 상세, en은 `/en` 상세에서 값 노출 확인(쓰기 검증 — read에서 en 안 찍는 것과 별개). 안정적 `/:id` 상세는 `expectEnDetailHeading` 사용. 공통 `$type/edit` 형제(history/contact/overview)는 greetings로 대표.
- 게시설정·토글(비공개·고정·태그·첨부·이미지)은 **대표 타입(notice)만**, 나머지는 동일 백엔드 메커니즘이라 주석으로 생략 명시.
- **로그인만 필요한 읽기**(admin 메뉴, staff 전용 예약실)도 flow에(visual 안 만듦).
- 게시설정 **시각**은 일반 사용자가 보는 것만 baseline에 심어 read로 캡처(고정 핀·메인 슬라이드). **비공개(잠금)은 staff 전용이라 시각 검증 안 함**, flow 동작(숨김)만.

## 결정론

- `globalSetup`이 매 런 **DB 리셋 → SQL 시드 → API 시드 → 날짜 정규화**. 빈 DB라 auto-increment id 고정. read 스펙은 baseline만 검증(도메인 `*_SEED` 상수를 기대값 단일 출처로 import). **flow 스펙은 baseline 안 건드리고 자기 항목만** 생성/편집/삭제(`Date.now()` 고유 이름).
- **날짜:** payload 날짜는 고정값. **서버가 박는 created_at/modifiedAt이 화면에 노출되면**(notice·메인 NewsCard·conference_page) `db.ts`(normalizeDates)가 globalSetup에서 고정값으로 정규화 — 새 게시물 테이블 추가 시 UPDATE 한 줄 추가. **마스킹보다 정규화 우선**(시:분 글자폭이 마스크 박스를 흔들어 불안정).
- **마스킹**은 정규화 불가한 비결정만 — 외부 SDK(KakaoMap), 백엔드 비정렬 컬렉션(groups 상세 labs Set). 상대시간 렌더 시 `page.clock`(현재 해당 없음).

## flow = stateful(실서버 영속성)

실서버라 "내가 만든 게 실제로 보이는가"를 추가→편집→삭제 전체로 직접 검증한다.

## 로그인(prod 형태)

`loginAsStaff`는 dev STAFF 버튼을 안 누른다(prod 빌드엔 없음). mock-login으로 세션 쿠키 발급 + reload → my-role이 세션 읽어 staff UI 렌더(프로덕션과 동일 화면).

## Form / 대기

- suneditor 사용(에디터 `.sun-editor-editable`, 한/영 전환은 `label[for="ko"|"en"]` 클릭). **Form 구동은 `tests/helpers/forms.ts` 단일 책임 함수로 — 인라인 재구현 금지.** 모든 CRUD 삭제는 `deleteItem` 경유(확인 버튼 라벨이 컴포넌트마다 달라 `confirmText`로 지정; Form.Action='확인', 게시글='삭제').
- 네비게이션은 `waitForURL`(명시적 URL 확인 우선). 에디터 언어 전환은 라디오 checked 대기. **`waitForTimeout` 금지 — 조건 대기로.** 나머지는 Playwright auto-waiting.

## 실행 / baseline

- **모든 테스트는 핀된 Playwright 컨테이너에서 돈다**(`pnpm test` = `scripts/e2e-docker.sh`: 백엔드 스택 `up --wait` 후 러너 컨테이너를 스택 네트워크에 붙임). 호스트 직접 실행 정식 경로 없음 — 렌더 환경을 컨테이너로 고정해야 baseline이 머신 무관하게 픽셀 동일. 로컬·CI가 같은 스크립트를 타는 단일 경로라 config도 조건 분기 없는 고정값(워커4·retries2 — 2026-08-29 실측으로 확정, 상세는 config 주석).
- **비주얼 baseline = Linux 단일(`*-linux.png`)**, 컨테이너가 정본 렌더 환경이라 머신 무관.
- **백엔드 기준 = `../csereal-server`(origin/main)** — baseline은 이 main 백엔드에서 찍고, E2E가 main 백엔드 스모크도 겸한다. 트레이드오프: main이 floating이라 **백엔드만 바뀌어도 baseline이 깨질 수 있음** → 백엔드를 최신 main으로 올리고(아래) `--update-snapshots`로 재생성.

## 백엔드 버전 동기화(cross-repo 런북)

docker가 **소스의 prebuilt JAR를 COPY**하므로 `../csereal-server` 소스가 낡으면 docker도 낡는다. 뒤처졌으면:
```bash
cd ../csereal-server && git fetch origin && git merge --ff-only origin/main
docker run --rm -v "$PWD":/app -v csereal-gradle-cache:/root/.gradle -w /app \
  eclipse-temurin:21-jdk ./gradlew bootJar -x test               # 호스트 JDK 11이라 Java21 컨테이너로 빌드
cd ../cse.snu.ac.kr && docker compose up -d --build backend  # 새 JAR로 이미지 재빌드
```
올린 뒤 `pnpm test --update-snapshots`로 baseline 재생성.

## 새 라우트 추가 / 확장

**전 라우트 커버 완료(2026-06)** — 커버리지 출처는 스펙 파일 자체(옛 COVERAGE.md는 임무 종료로 삭제). reference 구현 `tests/research/labs/` + `tests/setup/seed/research.ts`를 본뜬다.
- **시드는 API 우선**: 생성 API가 있으면 `tests/setup/seed/<domain>.ts`에 `<DOMAIN>_SEED` + 시더 만들고 `seed/index.ts`에 등록. **SQL은 예외** — 생성 API가 없는 content 싱글톤(PUT만 있고 POST 없어 빈 DB 500)만 `db.ts`(seedContent)에 INSERT. **API로 되면 절대 SQL 안 씀.**
- 도메인별 시드 모듈 + 중앙 조합(`seed/index.ts`), cross-domain 참조는 앞 시더 반환 id를 명시적으로 전달. 표시 문자열은 `*_SEED`에만(단일 출처).
- **복합 페이지는 편집 기능마다 별도 flow**(탭/섹션/테이블 인라인 편집 놓치기 쉬움). **POM 미사용** — 함수형 헬퍼 유지.
- 자율 진행 시 **묻지 말고 진행**. 실서버가 실버그를 잡으면 **증상 우회 말고 원인을 시스템 차원에서** 고치고 기록.
- **함정(겪은 것):** ① 태그 참조 테이블(tag_in_notice 등)은 Flyway가 아니라 enrollTag API로 채워지는데 reset이 비우므로 시더가 매 런 재등록해야 한다(없으면 태그 단 글 생성 500). ② SelectionList 인덱스(groups 등)는 en 정렬상 첫 항목이 자동 선택돼 링크가 아닌 제목으로 렌더 → en round-trip은 link 역할 대신 `getByText`로. ③ 의도적 보류: 만료일 날짜피커 입력 와이어링·suneditor 본문 이미지 업로드(에디터 구동 비용). ④ **세션 의존 loader는 `forwardAuthHeaders` 필수** — news·seminar 목록/상세/edit 5곳이 누락돼 SSR에선 비공개 글이 staff에게도 숨고 클라 네비에선 보이는 유령 동작이었다(2026-08-30 수정). 교훈: 게시설정을 notice만 대표 검증하는 트레이드오프는 백엔드 메커니즘엔 유효하지만 **라우트별 프론트 와이어링 차이는 못 잡는다** — 비공개 개념 있는 도메인의 loader를 새로 만들면 forwardAuthHeaders부터.

## 발견된 실버그(참고)

E2E가 실제 버그를 잡는다. 예: DELETE가 200 빈 본문을 반환하는데 `fetchJson`이 빈 본문을 파싱하다 throw → "삭제 성공인데 실패 토스트". → `fetchJson`을 빈 본문 시 undefined 반환하도록 **root-cause 수정**(22개 DELETE 사이트 일괄). 증상이 아니라 원인을 고친다.

---

# 4. 디자인 시스템

> **Storybook은 2026-08-30 제거** — 마이그레이션 감사(2026-06-16, 전 공용 컴포넌트 스토리화 + 실버그 수정) 이후 실사용이 없었고, 픽셀 회귀는 E2E 소유라 유지비(스토리 36개 동기화·SB 메이저 업그레이드·CSF 함정·CI build-storybook)만 남아서다. 스토리·설정·CSF Next 노하우는 git 히스토리(2026-08-30 이전) 참고. 감사가 잡은 수정들은 코드에 남아 있다.

- **디자인 토큰:** `src/app.css`의 `@theme`. **가로 페이지 거터는 `.page-gutter-x` 단일 출처**(좌 100/우 360/모바일 20px). 토큰화/스케일화는 **픽셀 동일할 때만 자율**; 값이 바뀌는 정규화는 디자인 결정 → 합의.
- **API 레이어 분리:** `ui/*`=제어 프리미티브(value/onChange, 어디서나) vs `form/*`=폼 전용(name+useFormContext, `FormProvider` 밖에선 크래시). ui/form 동명 컴포넌트는 어댑터 관계가 아니라 독립 구현(2026-08-30 확인). **의도된 분리 — 통합 금지.**
- **DS에 우겨넣지 않는다.** 일관성 깨지는 사용처는 컴포넌트 API 확장이 아니라 **앱 코드를 고친다**. 이렇게 잡은 실버그: Tag 삭제버튼 `aria-label`→`ariaLabel`.
- **단일 선택은 Button 토글이 아니라 네이티브 radiogroup**(`fieldset`+`radio` pill) — 그룹 시맨틱·화살표 키 이동을 브라우저가 준다(faculty 정렬·공지 필터). 그 결과 Button `variant`(과거 `kind`서 개명 — Tag와 통일)는 상태 없는 5개(primary/neutral/secondary/quiet/nav). **아이콘은 children에 직접**(shadcn식, base `gap-2`가 간격).
- **a11y:** form Radio/Checkbox=네이티브, Dialog/AlertDialog/Select/ImageModal=Radix(ARIA 자동). Button **icon-only는 `ariaLabel` 필수.**
- **합의 대기(자율 실행 금지):** ① `#202020`(공지 필터 pill 비선택 배경) 신규 색 토큰 — 매칭 토큰 없어 디자인 결정. ② 패딩 세로/내부 임의값 + `.62`/`.625` 근접중복 정규화(가로 거터는 완료).

---

**마지막 업데이트:** 2026-08-30 (배포·E2E 인프라 정리 머지 #20: 호스트 git-URL 빌드 전환·시크릿 2개·compose 루트 이관·E2E 러너 분리·워커/타임아웃 실측 확정·Storybook 제거·COVERAGE.md 삭제. 상세 히스토리는 git log — 이 로그는 최신 1건만 유지한다.)
