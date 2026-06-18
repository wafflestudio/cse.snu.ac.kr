# csereal-web-v2 작업 가이드 (에이전트용)

작업 전 읽는 단일 가이드. 앞부분은 **E2E 테스트 컨벤션 + 아키텍처**, 문서 끝에 **라우팅·코드 컨벤션**과 **Storybook·디자인 시스템**을 둔다. (사람용 온보딩·스크립트·환경 표는 `README.md`.)

> **상태:** RR7 → TanStack Start(file-based + idiomatic) 마이그레이션 **완료(2026-06-15)**, Storybook + 디자인 시스템 감사 **완료(2026-06-16)**. E2E는 이제 마이그레이션 전용이 아니라 **일반 회귀 안전망**이다.

## E2E 테스트 — 프론트가 렌더/동작/픽셀 동일한가를 지킨다(비주얼 회귀 포함).

## E2E 범위 기준 (무엇을 테스트하나) — 단일 잣대

> **"마이그레이션이 이걸 깨뜨린다면, 깨진 코드는 프론트 레포에 있나?"**
> **예 → E2E로 테스트한다. 아니오(백엔드가 깨짐) → 백엔드를 신뢰한다(테스트 추가 금지).**

백엔드는 마이그레이션 대상이 아니라 **고정된 실서버**라, 백엔드가 소유한 동작은 전후 불변 → E2E로 재면 비용(느림·flaky·stateful)만 들고 안전망 가치가 없다. ("실서버라 백도 곁다리로 검증된다"는 이유로 넓히지 않는다.)

| 프론트 소유 → **테스트함** | 백엔드 소유 → **신뢰(테스트 안 함)** |
|---|---|
| 렌더(콘텐츠/레이아웃·스크린샷) | 역할 **인가 강제**(역할이 엔드포인트 호출 가능/거부) |
| loader 와이어링(올바른 엔드포인트 fetch + 응답 파싱 + 필드→UI 매핑) | 비즈니스 규칙(409 충돌, 날짜 규칙, 정기예약 LABMASTER-only) |
| action 와이어링(payload 구성 + 엔드포인트 + 응답 처리=토스트/리다이렉트/revalidate) | 서버 검증, 정렬/검색(FTS) **순서·랭킹** |
| 클라 상태/상호작용(드롭다운·탭·모달·캐러셀·언어토글) | 영속 의미(cascade·기본값·계산 필드) |
| 조건부 렌더/게이팅(`LoginVisible` 노출/숨김·fallback, 핀/잠금 **아이콘 렌더**, isPrivate 글의 플래그 전송) | 그 데이터 자체의 정확성·필터링 결과 |

**경계 함정(이 기준으로 걸러진 실제 사례):**
- 게시설정은 "프론트가 플래그를 **전송**하나"(O, isPrivate/isPinned/titleForMain 전송 → action 와이어링)와 "백엔드가 **정렬/필터**한 결과"(X)를 구분. 고정 검증은 `boundingBox` **순서**(백엔드 정렬)가 아니라 **핀 아이콘 렌더**(프론트 조건부)로 한다.
- 역할 분기: "프론트가 역할별로 뭘 **렌더**하나"는 O(`LoginVisible`/staff-only 방 fallback), "백엔드가 역할별로 뭘 **허용**하나"는 X. 단 disallowed-로그인은 익명과 같은 false 브랜치라 read 스크린샷이 이미 커버 → 추가 안 함.
- 통합 seam은 와이어링 모양당 1번(예: "생성→목록에 뜸"). 모든 필드의 정확 저장까진 안 캠(그건 백엔드).

## 아키텍처 (왜 이렇게 됐는지가 중요)

```
브라우저 ──(localhost:3000만)──> server.ts (:3000, prod와 공유)
                                  ├─ /api/**  → hono proxy → 로컬 docker 백엔드 :8080 (API_PROXY_TARGET 설정 시)
                                  └─ 그 외     → TanStack Start SSR (프로덕션 빌드 dist/)
```

- **백엔드: 로컬 docker 실서버** (`../csereal-server`, local 프로파일, :8080).
  MySQL+Spring+Flyway. mock-login은 `@Profile("!prod")` 실엔드포인트(진짜 JSESSIONID 세션).
  **로컬 전용(격리·리셋 자유)이라 리셋+시드 자유. staging·프로덕션 서버는 절대 건드리지 않는다.**
  기동: `docker compose -f ../csereal-server/docker-compose-local-full.yml -f ../csereal-server/docker-compose-fe-test.yml up -d` (Playwright가 자동).

- **프론트: 프로덕션 빌드** 를 루트 `server.ts`(**Hono** + `@hono/node-server`)로 서빙. MSW/mock 안 씀. **이 서버는 prod 컨테이너와 공유**(Dockerfile CMD=`pnpm start`=`tsx server.ts`). `/api` 프록시는 `API_PROXY_TARGET` 설정 시에만(local/E2E). prod는 미설정 → 절대 URL 직호출.
  - **왜 server.ts가 필요한가:** TanStack Start 기본 빌드는 `dist/server/server.js`를 **Web fetch 핸들러**(서버 아님)로 내놓는다. Node HTTP 서버는 `IncomingMessage`/`ServerResponse`라 Web `Request`/`Response`를 안 써서(Node가 클래스는 주지만 서버 API는 req/res) **Node↔Web 다리가 필연**. Hono(+@hono/node-server)가 그 변환을 맡고(`handler.fetch(c.req.raw)` 한 줄), 정적서빙·`/api` 프록시도 같이. (Bun/Deno는 서버 API가 Web 표준이라 다리 불필요하지만 우리는 Node self-host.)
  - **왜 prod 빌드(dev 아님):** 비주얼 회귀가 dev≠prod면 무의미하고, E2E 정석은 배포 산출물 검증. dev의 콜드 컴파일 플레이키도 없음.
  - **왜 same-origin proxy:** 실서버 세션 쿠키(JSESSIONID)는 `Secure`라 브라우저 **cross-origin 요청에 안 실린다** → prod빌드를 :8080에 직접 쏘면 mutation 인증이 깨짐(302 OAuth). 그래서 브라우저는 :3000만 보고 `/api`를 서버사이드에서 :8080으로 proxy. 세션이 first-party로 유지되고 CORS/CSP도 무관 → **E2E용 앱 코드 수정 0.**

## 디렉터리 구조

라우트를 미러링한다.

```
server.ts                   # (루트) prod 빌드 서빙 + 선택적 /api proxy. prod 컨테이너·E2E 공유
tests/
├── setup/
│   ├── reset-db.sh         # DB truncate (결정론)
│   ├── seed-content.sh     # SQL 시드: content 싱글톤(about/academics/admissions) + 참조데이터(room, conference_page)
│   ├── normalize-dates.sh  # 서버가 박는 created_at/modifiedAt 고정값 정규화
│   ├── global-setup.ts     # 매 런 1회: 리셋 → SQL시드 → API시드 → 날짜정규화
│   └── seed/
│       ├── client.ts       # mockLoginCookie, postMultipart, postJson (공용)
│       ├── <domain>.ts     # research/about/community/people/academics/admissions/internal: *_SEED 상수 + seed<Domain>()
│       └── index.ts        # seedBaseline(): 도메인 시더 조합
├── helpers/
│   ├── auth.ts             # loginAsStaff (세션 쿠키, prod 형태)
│   ├── locale.ts           # setLocale (lang 쿠키 고정)
│   └── forms.ts            # 폼 구동 헬퍼 (단일 책임)
└── <도메인>/<라우트>/{read,flow}.spec.ts
```

## 테스트 2분류 (read / flow)

**분류 축: `read` = 비로그인 AND DB 변경 없음 · `flow` = 로그인 필요 OR DB 변경.**
모든 케이스가 둘 중 하나에 들어간다(검색=read, admin=flow).

> ✅ **컨벤션 리팩토링 완료**(2026-06-14): 전 라우트가 `read.spec.ts`(데스크톱 `read` + 모바일 `read-mobile`)
> + `flow.spec.ts`(en round-trip 포함) 구조다. smoke/visual은 제거됨. 신규 라우트도 아래 컨벤션으로 작성한다.

### `read.spec.ts` — 비로그인 사용자가 도달 가능한 모든 화면
- 핵심 콘텐츠 **1~2개 assert + `toHaveScreenshot`** (콘텐츠 계약 + 픽셀, 한 파일에서)
- **ko 전용** — en 읽기 화면은 안 찍는다(번역 텍스트만 바뀌어 가치 낮음)
- **데스크톱 + 모바일(390px)** — `read`/`read-mobile` 프로젝트가 같은 스펙을 돌려 baseline 자동 분리
  (`*-read-linux.png` / `*-read-mobile-linux.png`). **모바일 전용 코드 안 짠다.**
  - ⚠️ **콘텐츠 assert는 모바일에서도 보이는 요소로**: `hidden sm:*`(데스크톱 전용 SubNavbar·메가메뉴 등)
    텍스트를 assert하면 모바일에서 `hidden`이라 깨진다. 한 스펙이 두 viewport를 도니, **양쪽에 다 보이는
    요소**(본문 PageTitle·콘텐츠)를 고른다. (예: 10-10 하위 페이지는 SubNavbar 'Project' 대신 PageTitle을 assert)
- **상세 레이아웃이 목록/형제와 다르면 별도 스크린샷**: 같은 도메인이라도 컴포넌트 구성이 다르면(예: faculty 상세
  =Profile+LabNode vs emeritus/staff 상세=ProfileImage+Contact+InfoList) 대표 1장으로 갈음 말고 각 레이아웃을 캡처.
- **상태는 URL 우선**: `/search?keyword=`, `?tag=`, `?pageNum=`, `?selected=`, `?selectedDate=`로 직접 이동.
  URL로 안 되는 클라이언트 상태(드롭다운·탭·모달)는 read에서 클릭(비로그인·비변경이면 OK).
- **여러 상태 처리**:
  - 레이아웃이 다른 상태(모달·탭·펼침/접힘·빈 상태) → **각각** 스크린샷
  - 데이터만 다른 반복(SelectionList 항목·연도·페이지) → **대표 1장**
  - **빈 상태**(검색 결과 없음·목록 0개) → **가능한 곳 모두** (없는 키워드/태그로 유도)

### `flow.spec.ts` — 로그인(staff) 컨텍스트 또는 DB 변경
- **데스크톱만**, read 의존(mutation 전 read가 깨끗한 baseline 캡처)
- 한 파일에 `describe`로 **'CRUD' / '게시 설정' / '일괄 관리'** 구분
- **이중언어 콘텐츠 → en round-trip**: ko·en 입력 후 ko는 ko 상세에서, en은 `/en` 상세에서 값 노출 확인
  (en 입력값이 저장·표시되는지 검증. read에서 en을 안 찍는 것과 별개 — 이건 쓰기 검증).
  상세 URL이 `/:id`로 안정적이면 `helpers/locale.ts`의 `expectEnDetailHeading(page, enValue)` 사용(중복 제거).
  목록 인라인 상세(centers/groups/clubs/facilities)는 `/en` 목록에서 `getByText(enValue)`, 싱글톤(admissions/
  greetings/future-careers description)은 `/en` 본문에서 검증. 공통 `$type/edit` 형제(history/contact/overview)는
  greetings로 대표 검증(주석 명시).
- 게시설정·토글(비공개·고정·태그·첨부·이미지)은 **대표 타입(notice)만**, news/seminar 등은 동일 백엔드
  메커니즘이라 주석으로 생략 명시
- **로그인만 필요한 읽기**(admin 메뉴 렌더, staff 전용 예약실)도 flow에 둔다(visual 안 만듦)

### 게시 설정의 시각 (상태 변형)
- **일반 사용자가 보는 것만** baseline에 심어 read로 캡처: 고정(핀, notice 목록) · 중요·슬라이드(메인)
- **비공개(잠금)** → staff 전용이라 **시각 검증 안 함**, flow 동작(숨김)만

### Playwright 프로젝트 구조
```
read        : read.spec.ts,  데스크톱
read-mobile : read.spec.ts,  390px
flow        : flow.spec.ts,  데스크톱, dependencies: [read, read-mobile]
```

## 결정론 (determinism)

- `globalSetup`이 매 런 **DB 리셋 → SQL 시드(`seed-content.sh`) → API 시드(`seedBaseline`) → 날짜 정규화(`normalize-dates.sh`)**. 빈 DB라 auto-increment id 고정.
- **read 스펙은 baseline만 검증**. `RESEARCH_SEED` 등 도메인 시드 상수를 기대값 단일 출처로 import.
- **flow 스펙은 baseline을 건드리지 않고 자기 항목만** 생성/편집/삭제. 고유 이름(`Date.now()`)으로 충돌 방지. 게시 설정 등 baseline 상태를 바꾸는 토글은 자기 글에만.
- **날짜**: payload로 넣는 날짜(news.date, seminar.startDate)는 고정값이라 그대로. **서버가 박는 created_at/modifiedAt이 화면에 노출되면**(notice 목록·상세, 메인 NewsCard, conference_page) → `tests/setup/normalize-dates.sh`가 globalSetup에서 고정값(`2024-03-15`)으로 정규화. 새 게시물 테이블 추가 시 이 스크립트에 UPDATE 한 줄 추가. **마스킹보다 정규화 우선**(시:분 글자폭이 마스크 박스를 흔들어 마스킹이 불안정).
- **마스킹**: 정규화 불가한 비결정 요소만 — 외부 SDK(`#map` KakaoMap), 백엔드 비정렬 컬렉션(research/groups 상세의 labs Set). `toHaveScreenshot({ mask: [...] })`.
- 컴포넌트가 *상대시간*("3일 전")을 렌더하면 `page.clock`으로 시계 고정(현재 해당 없음).

## flow 검증 = stateful (실서버 영속성)

실서버라 "내가 만든 게 실제로 보이는가"를 직접 검증한다. 추가→편집→삭제 전체 플로우:

```typescript
test('staff가 X를 추가→편집→삭제한다', async ({ page }) => {
  const koName = `자동화 ${Date.now()}`;        // 고유 이름
  await setLocale(page, 'ko');
  await page.goto('/...');
  await loginAsStaff(page);                      // 세션 쿠키 (prod엔 STAFF 버튼 없음)

  // 추가 → 목록에 실제로 나타남
  // 편집 → 상세에 반영됨
  // 삭제 → 목록에서 사라짐
});
```

## 로그인 (prod 형태)

`loginAsStaff(page)`는 dev STAFF 버튼을 누르지 않는다(프로덕션 빌드엔 없음).
mock-login으로 세션 쿠키를 발급받고 reload → my-role이 세션을 읽어 staff UI 렌더. 프로덕션과 동일한 화면.

## Form 컴포넌트

- suneditor 사용. 에디터: `.sun-editor-editable`. 한/영 전환은 `label[for="ko"|"en"]` 클릭(라디오 숨김).
- Form 구동은 `tests/helpers/forms.ts`의 단일 책임 함수로(fillTextInput, fillHTMLEditor, switchEditorLanguage, selectDropdown, submitForm, deleteItem). 복합 동작(언어 전환+입력)은 스펙에서 조합. **인라인으로 재구현 말 것.**
  - `fillHTMLEditor(page, html, index?)`: 한 화면에 에디터가 여럿이면(예: seminar 요약+연사소개) index로 대상 지정(`:visible` 기준).
  - `deleteItem(page, confirmText?, trigger?)`: 트리거 '삭제' → 확인(`confirmText`, 기본 '확인') 처리. 한 화면에 '삭제'가 여럿(교수 학력별 삭제 + Form.Action, 행 스코프 삭제 등)이면 `trigger`로 명시(예: `.last()`, `row.getByRole('button',{name:'삭제'})`). **모든 CRUD 삭제는 이 헬퍼 경유**(일괄/예약취소 등 다른 의미의 삭제만 인라인).
- 드롭다운 옵션 라벨은 컴포넌트가 가공할 수 있음(예: 그룹 → "시스템 스트림").
- 삭제 AlertDialog 확인 버튼 라벨은 컴포넌트마다 다름(Form.Action='확인', 게시글/리스트='삭제') → `deleteItem`의 `confirmText`로 지정.

## 대기 처리

- 네비게이션: `waitForURL('**/path')` 또는 정규식. `waitForLoadState`보다 명시적 URL 확인 우선.
- 에디터 언어 전환: `switchEditorLanguage`가 라디오 `input#{lang}` checked를 대기(고정 슬립 아님). **테스트에 `waitForTimeout` 금지** — 조건 대기로.
- 나머지는 Playwright auto-waiting(`toBeVisible` 등)에 맡긴다. (prod 빌드라 hydration이 빨라 별도 마커 불필요. 진짜 `<button onClick>` 클릭이 플레이키하면 그 스펙에 국소 대응.)

## 실행

> **모든 테스트는 핀된 Playwright 컨테이너에서 돈다(`pnpm test` = `scripts/e2e-docker.sh`).**
> 호스트에서 직접 `playwright test`를 돌리는 정식 경로는 없다 — 렌더 환경을 컨테이너로
> 고정해야 baseline이 호스트(macOS)·CI(ubuntu) 무관하게 픽셀 동일하기 때문.

```bash
pnpm test                          # 전체. 백엔드(호스트 docker) 보장 후 컨테이너에서 실행
pnpm test --update-snapshots       # Linux baseline 재생성(호스트 tests/에 PNG 기록)
pnpm test tests/research/labs      # 특정 라우트(인자 패스스루)
pnpm test --project=read           # 데스크톱 read만 / --project=read-mobile / --project=flow
pnpm test:ui                       # UI 모드 — 호스트 브라우저에서 http://localhost:43210
```

`e2e-docker.sh` 동작: ① 백엔드(MySQL+Spring)를 **호스트** docker로 보장(이미 떠 있으면 재사용),
② 핀된 컨테이너(`mcr.microsoft.com/playwright:v1.57.0-jammy`)에서 앱 빌드·서빙·시드·브라우저·테스트.
컨테이너는 docker 소켓 없이 **host.docker.internal:8080/3306**으로 백엔드·DB에 TCP 접근한다
(시드 스크립트 TCP 경로 = `tests/setup/db-exec.sh`, `E2E_DB_HOST` 설정 시 docker exec 대신 mysql TCP).
node_modules는 named volume으로 격리돼 호스트 macOS 바이너리를 덮어쓰지 않는다.

### 비주얼 baseline은 Linux 단일 (CI 정합성)

> baseline은 **`*-linux.png` 단일 세트**. 컨테이너가 정본 렌더 환경이라 호스트 무관하게 픽셀 동일 → CI와 일치.

- **백엔드 기준 = 최신 `main`(floating).** CI(`BACKEND_REF: main`)가 매 실행 `wafflestudio/csereal-server@main`을
  새로 빌드하므로, baseline도 **그 main에서 찍어야** 픽셀이 맞는다. FE E2E가 main 백엔드의 스모크 검증도 겸한다.
  - 트레이드오프: main이라 **백엔드가 바뀌면 FE를 안 건드린 PR인데도 baseline이 깨질 수 있다** → 그땐 baseline 재생성.
    (결정성을 더 원하면 `BACKEND_REF`를 SHA로 핀하고 의도적으로 올리는 고정 오라클로 전환. 현재는 floating main 채택.)
- **baseline 재생성은 CI와 같은 백엔드(최신 main)에서 해야 정확하다.** 로컬 백엔드가 다른 브랜치(예: v3)면
  `pnpm test --update-snapshots`가 잘못된 baseline을 만든다 → 이 경우 **CI에서 생성**:
  `Actions → E2E (Playwright) → Run workflow`(update_snapshots) → `linux-baselines` 아티팩트 다운로드
  → `tests/`에 풀어 커밋. (로컬 백엔드가 최신 main이면 `pnpm test --update-snapshots`로 바로 생성 가능.)

### CI (GitHub Actions)

`.github/workflows/playwright.yml` — push/PR(main)에서 E2E 전체:
1. FE + 백엔드(`wafflestudio/csereal-server@main` 최신) 체크아웃 → `./gradlew bootJar`(JDK 21).
2. `scripts/e2e-docker.sh`가 `docker compose up`(베이스 compose + FE 소유 오버라이드
   `tests/setup/backend/docker-compose-fe-test.yml`)으로 백엔드 기동 → 컨테이너에서 테스트 →
   커밋된 `*-linux.png` 대조.
3. 백엔드 ref는 워크플로 상단 `BACKEND_REPO`/`BACKEND_REF`(+ `BACKEND_DIR`) env로 오버라이드 가능.

## 백엔드 버전 동기화 (중요)

로컬 `../csereal-server`는 docker가 **소스의 prebuilt JAR를 COPY**한다(Dockerfile). 소스가 낡으면 docker도 낡음.
**기준은 항상 최신 main**(CI와 동일). 로컬이 뒤처졌거나 다른 브랜치(v3 등)면 main으로 맞춰 백엔드를 올린다:
```bash
cd ../csereal-server && git merge --ff-only origin/main          # develop이 뒤처졌을 때
docker run --rm -v "$PWD":/app -v csereal-gradle-cache:/root/.gradle -w /app \
  eclipse-temurin:21-jdk ./gradlew bootJar -x test               # 호스트 JDK가 11이라 Java21 컨테이너로 빌드
cd ../cse.snu.ac.kr && docker compose -f ../csereal-server/docker-compose-local-full.yml \
  -f ../csereal-server/docker-compose-fe-test.yml up -d --build   # 새 JAR로 이미지 재빌드
```
기준은 최신 main(image-modal·FTS·교수 en 이름 버그 수정 등 반영). baseline은 이 main에서 생성한다.

## 진행 현황 & 다른 세션에서 이어가기

**목표는 전 라우트 100% 커버리지.** 진행 상태는 `tests/COVERAGE.md`가 단일 출처다.
새 세션은 이 순서로 이어간다:

1. `tests/COVERAGE.md`에서 진행 상태를 본다(전 라우트 read/flow 커버 + 컨벤션 리팩토링 완료).
2. 신규 라우트는 아래 "다음 라우트 추가 런북"대로 `read.spec.ts`/(`flow.spec.ts`)를 작성한다.
3. 라우트를 끝내면 `tests/COVERAGE.md`의 해당 칸을 ✅로 갱신하고 baseline PNG를 함께 커밋한다.

reference 구현은 `tests/research/labs/`(`read.spec.ts`+`flow.spec.ts`)와 `tests/setup/seed/research.ts`. 새 라우트는 이걸 본뜬다.

### 다음 라우트 추가 런북

1. **라우트 조사** — `app/routes/<경로>/index.tsx`의 loader가 호출하는 API(`${BASE_URL}/v2/...`)와 화면에 쓰는 필드, 편집/추가/삭제 유무를 본다. 편집 폼은 `*/edit.tsx`, `*/create.tsx`의 onSubmit이 보내는 엔드포인트/payload를 본다.
2. **시드** — 그 라우트가 읽을 데이터가 없으면 시드 추가. **API 우선**: 생성 API가 있으면 `tests/setup/seed/<domain>.ts`에 `<DOMAIN>_SEED` + `seed<Domain>(cookie)` 만들고 `seed/index.ts`에 등록(`postMultipart` 사용, 페이로드는 `create.tsx` onSubmit + 백엔드 `ReqBody` 참고). **SQL은 예외**: API 생성 경로가 없는 content 싱글톤(about overview/greetings/history/contact처럼 PUT만 있고 POST 없음 → 빈 DB 500)만 `tests/setup/seed-content.sh`에 SQL INSERT로 추가(utf8mb4, `seed/about.ts` 상수와 텍스트 일치). API로 가능하면 절대 SQL 쓰지 말 것.
3. **스펙** — `tests/<domain>/<route>/`:
   - `read.spec.ts`(비로그인): 핵심 콘텐츠 1~2개 assert + `toHaveScreenshot`(ko, 도달 가능한 화면들·빈 상태 포함). 데/모바일은 프로젝트가 자동.
   - `flow.spec.ts`(로그인/변경): stateful CRUD + 게시설정 + (이중언어면) en round-trip, 고유 이름.
4. **baseline** — `pnpm test --update-snapshots`(컨테이너=CI 환경), PNG 커밋(`-read-linux.png` + `-read-mobile-linux.png`). 로컬 백엔드가 #399가 아니면 CI에서 생성(위 §실행).
5. **검증** — `pnpm test tests/<domain>` 그린 확인 후 `COVERAGE.md` 갱신.

### 자율 진행 시 주의
- **묻지 말고 진행**하되, 라우트별로 끝낼 때마다 `COVERAGE.md`를 갱신해 컨텍스트가 끊겨도 이어지게 한다.
- 백엔드(:8080)·preview(:3000)가 떠 있으면 `--update-snapshots` 없이 `pnpm test`가 빠르다(빌드 재사용). 앱 코드를 고쳤으면 빌드 재실행 필요(서버 죽이고 `pnpm test`).
- 실서버가 실제 버그를 잡으면(예: DELETE 토스트) **증상 우회 말고 원인을 시스템 차원에서** 고치고 `COVERAGE.md` 알려진 이슈에 기록.

## 확장 가이드 (라우트/도메인 추가 시)

새 라우트는 보통 다음 순서:

1. **시드 추가** — 그 도메인 데이터가 없으면 `tests/setup/seed/<domain>.ts` 생성:
   `<DOMAIN>_SEED` 상수(기대값) + `seed<Domain>(cookie)` 시더. `seed/index.ts`에 한 줄 등록.
   기존 도메인이면 해당 `*_SEED`에 항목만 추가.
2. **스펙 작성** — `tests/<도메인>/<라우트>/read.spec.ts`(비로그인 콘텐츠+스크린샷), 편집/로그인 필요하면 `flow.spec.ts`.
   기대값은 `*_SEED`에서 import(하드코딩·id 금지, 링크 클릭으로 상세 진입).
3. **baseline 생성** — `pnpm test --update-snapshots`(컨테이너)로 비주얼 PNG 커밋(데스크톱+모바일, `*-linux.png`).

### 확장 시 관리 원칙

- **도메인별 시드 모듈, 중앙 조합.** seed 파일이 비대해지지 않게 도메인별로 쪼개고 `seed/index.ts`에서 의존 순서대로 조합. cross-domain 참조는 앞 시더가 반환한 id를 index.ts에서 명시적으로 넘긴다.
- **기대값 단일 출처.** 표시 문자열·이름은 `*_SEED`에만 두고 스펙은 참조만. 데이터 바뀌면 한 곳만 고치면 됨.
- **복합 페이지는 편집 기능마다 별도 flow 테스트.** 한 페이지에 편집 버튼이 여럿이거나 인라인 추가/편집이 있으면 각각 별도 테스트(놓치기 쉬움: 탭/섹션/테이블 인라인 편집).
- **비주얼 baseline은 Linux 단일**(`*-linux.png`). 핀된 Playwright 컨테이너가 정본 렌더 환경이라 호스트 무관하게 CI와 픽셀 일치(위 §실행 "비주얼 baseline은 Linux 단일"·§CI 참고). ✅ CI 도입 완료(2026-06-17).
- **POM 미사용.** 함수형 헬퍼 패턴 유지(간단·직관). 페이지별 복잡 로직이 늘면 그때 하이브리드 고려.

## 발견된 실버그 (참고)

E2E가 실제 버그를 잡을 수 있다. 예: DELETE는 200 빈 본문을 반환하는데 앱 `fetchJson`이 빈 본문을 파싱하다 throw → "삭제 성공인데 실패 토스트". → `fetchJson`을 빈 본문 시 undefined 반환하도록 root-cause 수정(22개 DELETE 사이트 일괄 해결). 증상이 아니라 원인을 시스템 차원에서 고친다.

---

# ② 라우팅 · 코드 컨벤션 (마이그레이션에서 확립)

- **라우팅: file-based** (`app/routes/**` → 생성 `app/routeTree.gen.ts`). 라우트 파일은 `createFileRoute('/path')({ loader, component })`.
- **로케일: optional path param `{-$locale}`.** `app/routes/{-$locale}/**`에 1벌만. 매칭: `/about`(ko, 프리픽스 없음) · `/en/about`(en). 비로케일 라우트(`admin` · `[.]internal` · `img` · `sitemap`)는 `{-$locale}` 밖 `app/routes/` 직속. `__root` beforeLoad가 `/ko`→bare redirect + 쿠키(`lang`)·Accept-Language로 로케일 판정.
- **⚠️ 로케일 링크는 항상 `localizedPath()`.** 수동 `/${locale}/...` 문자열 **금지** — ko에서 `/ko/...` 링크를 **클라 네비로 클릭**하면 `__root`의 `/ko`-strip redirect가 렌더 루프(메인스레드 peg)를 일으킨 실버그가 있었다(notice 상세 wedge). `localizedPath`는 ko에서 프리픽스 없는 경로를 만들어 이 라운드트립을 제거한다.
- **loader는 `createFileRoute`에 인라인.** 분리 `async function loader` + wiring 안 씀. 컴포넌트는 `Route.useLoaderData()`/`Route.useParams()`를 **직접 호출**(prop 주입 안 함) → 라우트 path에서 params 자동 타입.
- **mutation은 대부분 클라이언트 `fetch`**(same-origin proxy 경유). `action`은 거의 없음.
- **검색/페이지네이션은 공용 `app/hooks/useSearchParams.ts`**(URLSearchParams 기반). Pagination·SearchBox·TagCheckboxes가 여러 라우트에서 공유돼 라우트별 타입인 `Route.useSearch`/`validateSearch`는 부적합 — 표준 URLSearchParams 훅이 이 용례에 맞다.
- **서버 라우트(Response 직접 반환):** `/img`(이미지 최적화 프록시 — sharp·AVIF·디스크캐시·SSRF 화이트리스트), `/sitemap.xml` → `app/routes/img.ts`·`app/routes/sitemap[.]xml.ts`의 `server.handlers.GET`. 코어 로직은 `app/lib/server/img.tsx`·`app/sitemap.tsx`. dev 분기는 `import.meta.env.DEV`.
  - `/img`가 시스템 유일의 이미지 최적화 계층(백엔드는 원본만 정적 서빙, `Image` 컴포넌트가 렌더타임에 `/img?url=...` 생성 — DB엔 원본 URL만 저장). 장기적으론 백엔드/CDN(imgproxy)으로 이관 검토.
- **TanStack 함정(겪은 것):**
  - 같은 라우트 재진입 시 컴포넌트를 **재마운트 안 할 수 있음** → `useState(props)` 초기화가 안 됨(TimelineViewer 연도선택 버그). URL/props 파생으로 처리.
  - 클라 네비 시 **loader가 클라에서 실행** → 합성 request엔 쿠키 없음. 인증 의존 loader 주의(`forwardAuthHeaders`로 서버 헤더 전달).
  - `getRequestHeaders()`는 **Headers 객체**(`.get()` 사용, 프로퍼티 접근 금지).
- **빌드/서빙: 루트 `server.ts`**(prod 컨테이너 + E2E 프리뷰 공유). 환경 = production/staging/local(README 표). same-origin `/api` 프록시는 **로컬 전용**(`API_PROXY_TARGET` 설정 시) — 배포는 프론트·백엔드가 같은 도메인이라 절대 URL 직호출이라 프록시 불필요(이유는 위 §아키텍처 세션 쿠키).

---

# ④ Storybook · 디자인 시스템

- **설정:** SB 10.4 `@storybook/tanstack-react`(TanStack Start 자동감지·라우터 컨텍스트 내장). 스토리 글롭 `app/**/*.stories.@(ts|tsx)`(컴포넌트 코로케이션). `.storybook/`: `main.ts`(`defineMain`; viteFinal에 `@tailwindcss/vite` + `@/lib/serverFns` alias)·`preview.tsx`(`definePreview`; app.css·sonner import + autodocs + `addons:[addonA11y(), addonDocs()]`)·`withForm.tsx`(RHF FormProvider 데코). Chromatic 애드온은 제거(미사용 — 픽셀 회귀는 E2E 담당). CI(`playwright.yml`의 `storybook-build` 잡)가 빌드 회귀를 PR에서 차단.
- **포맷: CSF Next(CSF Factories).** 스토리는 `import preview from '…/.storybook/preview'` → `const meta = preview.meta({…})` → `export const X = meta.story({…})`. default export·`satisfies Meta`·`StoryObj<typeof meta>` 안 씀. 핸들러 args는 `() => {}` 대신 `storybook/test`의 `fn()`(Actions 패널에 호출 로깅) — 단 `useArgs`/`useState` render로 덮이는 핸들러는 noop 유지(발화 안 함). a11y 강제는 `addon-vitest` 충돌로 미도입 → `a11y.test:'todo'`(수동 검사).
- **배포:** Dockerfile이 `build-storybook`까지 빌드해 `storybook-static`을 이미지에 포함, `server.ts`가 **`/storybook`** 으로 서빙(prod·staging 공통). storybook-static 에셋은 상대경로라 서브패스 OK, 앱 `/assets`와 안 섞인다(`/storybook/assets`). 로컬은 `pnpm storybook`(:6006).
- **함정(재발 주의):**
  - **addon-vitest 설치 금지** — `playwright@1.60`을 끌어와 앱 E2E `@playwright/test@1.57`와 충돌. 그래서 `sb.mock` 대신 **Vite alias**로 `@/lib/serverFns`를 `.storybook/serverFns.mock.ts`(no-op)로 대체(useLanguage의 `createServerFn` `.validator`가 SB 브라우저서 throw → 빈 렌더 회피).
  - **viewport는 SB10 코어 내장** — 별도 애드온 없이 `parameters.viewport.options` + `globals.viewport`로 모바일 폭 고정(MobileNav `sm:hidden` 스토리에 사용).
  - **union 필수 prop은 스토리에 args 명시** — string-literal union 필수 prop(`kind`/`variant`/`colorTheme`/`theme`/`selected` 등)을 가진 컴포넌트는 CSF4가 `meta.args`만으론 "충족"을 인식 못 한다(한 prop이라도 union이면 `children` 포함 **필수 args 전체**를 각 스토리에서 재요구) → 해당 스토리에 args를 명시(공통 `children`은 상수로 공유). discriminated-union 컴포넌트의 합성 render는 무인자(`render: () => …`)로 둬 union 파라미터 추론을 피한다. (union 없는 필수 prop은 `meta.args`로 충족됨 — 예: Fieldset은 필수 `children`/`title` 있어도 bare `meta.story()` OK.) typed parameters라 `docs.story.iframeHeight`는 number 아닌 **string**(`'440px'`).
  - **모달/오버레이는 `open` 강제 대신 트리거+`play`** — 모달을 `open:true`로 열어두면 portal 오버레이가 **Docs 페이지 전체를 덮어** `docs.story.inline:false`(독립 iframe)를 강요하는데, **그 iframe은 컨트롤 라이브 업데이트를 못 받는다**(Docs에서 args 수정해도 미반영 — 실제로 겪은 버그). 그래서 **닫힌 채 렌더(트리거 버튼+`useState`) + `play`로 연다.** `play`는 **canvas에서만 자동 실행되고 Docs에선 기본 미실행**(`docs.story.autoplay` 기본 false)이라 → Docs는 닫힌 트리거만 보여 오버레이 없음 + inline이라 컨트롤 정상 반영, canvas는 자동으로 열어 보여줌. controlled 모달(AlertDialog/Dialog: `open`/`onOpenChange`)은 스토리 `render`에서 `useState`로 제어, 트리거 없는 마운트형(ImageModal)은 클릭 시 `key`로 (재)마운트. 클릭 트리거가 이미 있는 컴포넌트(Dropdown·DatePicker)는 `play`로 그 트리거를 누르고 `inline:false`만 제거. (상시 표시·fixed라 트리거가 없는 LeftNav만 inline:false 유지 — 모달 아님.)
- **현황:** 공용 컴포넌트 ~42개. 제외 7: `Form`·`html/HTMLEditor`·`CategoryPage`·`PageLayout`(합성/외부 의존), `LoginVisible`(역할 게이팅 **로직**, 자체 시각 없음 — 가짜 placeholder 필요해 '실사용만' 위반), `ContentSection`(tone+padding **레이아웃 래퍼**), `NotFound`(Header+ErrorState **합성** — 둘 다 개별 스토리 있음, 404 시각은 ErrorState가 커버). 모두 **E2E가 실동작 커버**. + `Foundations/Design Tokens`(색·거터 토큰 문서용 스토리). → **전 공용 컴포넌트가 스토리 또는 제외 사유 보유.**
- **폼 스토리:** `withForm` 데코레이터가 `parameters.formValues`로 `defaultValues`를 받는다(DatePicker=Date·File=배열 등 값 shape 가정 컴포넌트는 필수, 없으면 크래시). Radio·Checkbox는 같은 `name` 공유 **그룹**으로 보여준다(실사용). `Image` 예시는 `/img`(SB에 없음)를 안 타도록 data-URI 사용.
- **스토리 작성 원칙(사용자 지시):**
  1. **실사용 조합만.** 서비스에서 안 쓰는 variant/state를 창조하지 않는다(사용처 grep으로 확인). "쓰는데 공용으로 빼야 하나"는 고민·기록.
  2. **DS에 우겨넣지 않는다.** 컴포넌트 일관성이 깨지는 사용처는 비주얼이 깨지더라도 **앱 코드를 고친다**(컴포넌트 API를 늘려 수용 X). 이렇게 잡은 실버그: scholarship `iconLeft="add"`(문자열이 리터럴 렌더), Tag 삭제버튼 `aria-label`→`ariaLabel`(접근명 누락).
- **디자인 토큰:** `app/app.css`의 `@theme`(색 `main-orange`/`neutral`, 폰트). **가로 페이지 거터는 `.page-gutter-x` 단일 출처**(좌 100px/우 360px/모바일 20px; `PageLayout`·`ContentSection`이 소비). 토큰화/스케일화는 **픽셀 동일할 때만 자율**(예: `#e65817`→`main-orange-dark` 바이트 동일). 값이 바뀌는 정규화는 디자인 결정 → 합의.
- **API 일관성:** `ui/*`=제어 프리미티브(value/onChange), `form/*`=RHF 어댑터(`name`+useFormContext). **의도된 레이어 분리 — 통합 금지.**
- **a11y:** form Radio/Checkbox=네이티브, Dialog/AlertDialog/Select/ImageModal=Radix(ARIA 자동). Button **icon-only는 `ariaLabel` 필수**(호출자 제공). a11y 애드온은 `test:'todo'`(자동 실패는 addon-vitest 필요 → 미도입).
- **합의 대기(자율 실행 금지):** ① Button `ghost` variant = **데드코드(0회 사용)** → 제거 제안. ② `#202020`(Button pill 근검정) 신규 색 토큰 — 매칭 토큰 없어 디자인 결정. ③ 패딩 **세로/컴포넌트 내부** 임의값 + `.62`/`.625` 근접중복 정규화(가로 거터는 완료).

---

**마지막 업데이트:** 2026-06-19 (Storybook을 **CSF Next(CSF Factories)**로 마이그레이션 — §④ 포맷·함정 갱신: `preview.meta`/`meta.story`, `defineMain`/`definePreview`, `fn()` 스파이, union 필수 prop args 명시, iframeHeight string, Chromatic 제거 + CI `storybook-build` 가드. 이전: 2026-06-16 마이그레이션·Storybook·디자인 시스템 완료, E2E 176 그린.)
