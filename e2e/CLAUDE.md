# e2e 작업 가이드

프론트가 **렌더/동작/픽셀 동일한가**를 지킨다. 실행 경로·환경은 루트 `CLAUDE.md`, 프론트 컨벤션은 `apps/web/CLAUDE.md`. 여기 경로는 이 디렉터리 기준.

# 범위 — 단일 잣대

> **"이게 깨진다면 깨진 코드가 프론트에 있나?"** 예 → E2E. 아니오(백엔드) → 백엔드를 신뢰(테스트 추가 금지).

백엔드는 실서버(같은 커밋의 `apps/api`)라 그 소유 동작은 자기 테스트(`pnpm api:test`)가 지킨다. E2E 로 재면 비용(느림·flaky·stateful)만 든다.

| 프론트 소유 → **테스트함** | 백엔드 소유 → **신뢰** |
|---|---|
| 렌더(콘텐츠/레이아웃·스크린샷) | 역할 **인가 강제** |
| loader 와이어링(fetch + 파싱 + 필드→UI) | 비즈니스 규칙(409, 날짜, 정기예약 권한) |
| action 와이어링(payload + 엔드포인트 + 토스트/리다이렉트/revalidate) | 서버 검증, 정렬/검색 순서 |
| 클라 상태/상호작용(드롭다운·탭·모달·캐러셀·언어토글) | 영속 의미(cascade·기본값·계산 필드) |
| 조건부 렌더/게이팅(핀/잠금 **아이콘 렌더**, isPrivate 플래그 전송) | 데이터 정확성·필터링 결과 |

경계 사례: 게시설정은 프론트가 플래그를 **전송**하나(O) ↔ 백엔드가 정렬/필터한 결과(X) → 핀 **아이콘 렌더**로 검증. 역할 분기는 프론트가 뭘 렌더하나(O) ↔ 백엔드가 뭘 허용하나(X). 통합 seam 은 와이어링 모양당 1번("생성→목록에 뜸"), 모든 필드 정확 저장까진 안 본다.

# 분류

**`read` = 비로그인 AND DB 변경 없음 · `flow` = 로그인 필요 OR DB 변경.** 전 라우트가 `read.spec.ts`(`read` 데스크톱 + `read-mobile` 이 같은 스펙 공유) + `flow.spec.ts`. reference 구현은 `tests/research/labs/` + `tests/setup/seed/research.ts`.

크로스커팅 스펙 둘은 와이어링 모양당 1번만, read 단계에서 병렬, flow 의 선행: `tests/language.spec.ts`(로케일 리다이렉트·우선순위·토글·hreflang) · `tests/security.spec.ts`(상태 코드·보안 헤더 — 렌더만 보는 read 는 "화면은 맞는데 HTTP 응답이 틀린" 상태를 통과시킨다. DB 무관이라 baseURL 만 바꾸면 실환경에도 쏠 수 있다).

**read** — 비로그인이 도달 가능한 모든 화면. 핵심 콘텐츠 1~2개 assert + `toHaveScreenshot`. ko 전용.
- ⚠️ assert 는 모바일에서도 보이는 요소로 — 한 스펙이 두 viewport 를 도니 `hidden sm:*` 텍스트를 assert 하면 모바일서 깨진다.
- 상세 레이아웃이 형제와 다르면 별도 스크린샷.
- 상태는 URL 우선(`?keyword=`·`?pageNum=`·`?selectedDate=`). ⚠️ 단 URL goto 는 SSR 전체 로드라 클라 네비 경로를 안 탄다 — 검색 파라미터를 **바꾸는 컨트롤**(페이지네이션·필터·날짜 이동)은 도메인당 1개를 **클릭**으로 검증(reservations/room read 가 reference). 이게 `loaderDeps` 누락을 잡는 유일한 방법이다.
- 레이아웃 다른 상태(모달·탭·빈 상태)는 각각, 데이터만 다른 반복은 대표 1장, 빈 상태는 가능한 곳 모두.

**flow** — staff 로그인 또는 DB 변경. 데스크톱만, read 의존. `describe` 로 CRUD/게시 설정/일괄 관리 구분.
- 이중언어는 en round-trip(ko 입력 → ko 상세, en 입력 → `/en` 상세). 안정적 `/:id` 상세는 `expectEnDetailHeading`.
- 게시설정·토글은 대표 타입(notice)만 — 나머지는 같은 백엔드 메커니즘. ⚠️ 이 트레이드오프는 백엔드 메커니즘엔 유효하지만 라우트별 프론트 와이어링 차이(예: `forwardAuthHeaders` 누락)는 못 잡는다.
- 로그인만 필요한 읽기(admin 메뉴, staff 전용 예약실)도 flow 에. 비공개(잠금)는 staff 전용이라 시각 검증 안 함, 숨김 동작만.

# 결정론

- `globalSetup` 이 매 런 DB 리셋 → SQL 시드 → API 시드 → 날짜 정규화. 빈 DB 라 auto-increment id 고정. read 는 baseline 만 검증(`*_SEED` 상수가 기대값 단일 출처). flow 는 baseline 을 건드리지 않고 자기 항목만(`Date.now()` 이름).
- **시드는 API 우선.** SQL 은 생성 API 가 없는 content 싱글톤만(`db.ts`). 태그 참조 테이블은 Flyway 가 아니라 enrollTag API 로 채워지는데 reset 이 비우므로 시더가 매 런 재등록해야 한다(없으면 태그 단 글 생성 500).
- **날짜:** payload 는 고정값. 서버가 박는 created_at/modifiedAt 이 화면에 노출되면 `db.ts` 의 normalizeDates 가 고정값으로 정규화 — 새 게시물 테이블은 UPDATE 한 줄 추가. 마스킹보다 정규화(시:분 글자폭이 마스크 박스를 흔든다). 마스킹은 정규화 불가한 것만(KakaoMap, 백엔드 비정렬 컬렉션).
- SelectionList 인덱스(groups 등)는 en 정렬상 첫 항목이 자동 선택돼 링크가 아닌 제목으로 렌더 → en round-trip 은 `getByText`.

# 로그인 · Form · 대기

- `loginAsStaff` 는 mock-login 으로 세션 쿠키 발급 + reload(prod 빌드엔 dev 버튼이 없다). my-role 이 세션을 읽어 staff UI 를 렌더 — 프로덕션과 같은 화면.
- **Form 구동은 `tests/helpers/forms.ts` 단일 책임 함수로 — 인라인 재구현 금지.** 삭제는 `deleteItem`(확인 버튼 라벨이 컴포넌트마다 달라 `confirmText`). suneditor 는 `.sun-editor-editable`, 한/영 전환은 `label[for="ko"|"en"]`. 붙여넣기 테스트는 `ClipboardEvent` 를 직접 dispatch 하고 `/api/v2/content/sanitize` 응답을 기다린다.
- 네비게이션은 `waitForURL`, 에디터 언어 전환은 라디오 checked 대기. **`waitForTimeout` 금지.**
- POM 미사용 — 함수형 헬퍼.

# 실행 · baseline

- 항상 핀된 Playwright 컨테이너(`e2e/run.sh`). 호스트 직접 실행은 정식 경로가 아니다 — baseline(`*-linux.png`)은 컨테이너 렌더 기준이라 머신 무관. 로컬·CI 가 같은 스크립트라 config 도 조건 분기 없는 고정값(워커·retries 는 실측으로 정함, 상세는 config 주석).
- 백엔드는 같은 커밋의 `apps/api`. 백엔드를 고친 PR 에서 렌더가 바뀌면 같은 PR 에서 `pnpm e2e --update-snapshots`. 러너가 먼저 API 타입 드리프트를 검사하므로 백엔드 API 를 고쳤으면 `pnpm gen:api` 도 같은 PR 에.
- 복합 페이지는 편집 기능마다 별도 flow. 자율 진행 시 묻지 말고 진행하되, 실서버가 실버그를 잡으면 증상 우회 말고 원인을 고치고 기록한다.
