# 디자인 시스템 작업판

> 이 파일은 작업 계획과 진행 상황만 담는다. 디자인 규칙은 `/design-system` 페이지가 정본이다.
> 머지 전에 지운다. 경로는 `apps/web/src/` 기준.

## 지금

- **진행 중:** 2-6 토스트
- **다음:** 2-7 에디터
- **완료:** 13 / 27

## 목표

- `/design-system` 페이지만 보고 AI가 판단 없이 일관된 화면을 만들 수 있다.
- 기존 화면이 그 페이지대로 보인다. 같은 역할은 같은 모습이다.

## 단위마다 하는 일

1. `/design-system`(한 페이지)에 그 영역을 쓴다. 눈에 띄는 선택이 있으면 거기서 묻는다.
2. 승인되면 앱 전체에 적용한다. 아래 "이전에 본 문제"를 모두 처리하거나 남기는 이유를 한 줄 적는다.
3. `:3001`(develop)과 `:3000`(작업 중)을 나란히 열어 확인한다. 공개 화면은 320px·중간 폭·데스크톱, 관리 화면은 1200px 이상. 한국어·영어, 긴 텍스트.
4. 커밋하고 이 파일의 상태를 채운다.

## 한눈에

상태: ✅ 완료 · 🔄 진행 중 · ⬜ 남음

| 단계 | 단위 |
|---|---|
| 0. 준비 | ✅ 0-1 뼈대 |
| 1. 기반 | ✅ 1-1 레이아웃·반응형 · ✅ 1-2 색 · ✅ 1-3 글자 · ✅ 1-4 간격 · ✅ 1-5 모서리·그림자·선 · ✅ 1-6 아이콘 · ✅ 1-7 그래픽 |
| 2. 컴포넌트 | ✅ 2-1 버튼 · ✅ 2-2 입력·폼 · ✅ 2-3 선택·태그 · ✅ 2-4 모달 · ✅ 2-5 검색 입력 · 🔄 2-6 토스트 · ⬜ 2-7 에디터 |
| 3. 패턴 | ⬜ 3-1 페이지 틀 · ⬜ 3-2 내비게이션·셸 · ⬜ 3-3 목록·상태 화면 · ⬜ 3-4 게시물 상세 · ⬜ 3-5 읽는 본문·이미지 · ⬜ 3-6 메인·카테고리 · ⬜ 3-7 고유 화면 · ⬜ 3-8 문구 |
| 4. 마무리 | ⬜ 4-1 기준 이미지 · ⬜ 4-2 접근성 · ⬜ 4-3 검증 · ⬜ 4-4 정리 |

출처: **[C]** Claude 브랜치 `origin/tmp/design-system`의 `-decisions.md` · **[X]** Codex 브랜치 `feature/design-system`의 `DECISIONS.md`(DS-번호) · **[조사]** 이번 세션 코드 조사.

---

## 0. 준비

**목표:** 검토할 자리를 만든다. 이후 단위는 모두 이 페이지에 쓰고 여기서 본다.
**끝나면:** `/design-system`이 열리고 정체성 문단과 빈 영역 자리가 보인다.

### ✅ 0-1 `/design-system` 뼈대

- 한 페이지 문서다. [C]는 절마다 라우트와 MDX로 나눴다.
- 맨 위에 정체성 문단 '추상의 구상'을 둔다([C] `-intro.mdx`, 사용자가 마음에 들어함).
- 페이지 자신도 임의값을 쓰지 않는다. [C]는 문서 페이지에만 임의값이 104개였다.
- 실제 컴포넌트를 렌더한다. [C]는 데모 31개 중 14개가 손으로 만든 모형이라 앱과 어긋났다.
- 토큰 사본을 만들지 않는다. [C] `-tokens.ts`는 `app.css`를 손으로 옮긴 사본이었다.

---

## 1. 기반

**목표:** 화면을 이루는 값의 단계를 정한다. 무엇이 더 중요한지(면·강조·정보 단계)를 먼저 정하고 값은 그 단계에 붙인다.
**끝나면:** 색·글자·간격·모서리·그림자의 임의값과 팔레트 밖 hex가 앱에 0개다. 치수(`w-[..]`·`h-[..]`·`max-w-[..]`)는 1-1에서 레이아웃 폭만 단계로 모으고, 그래픽 접합 보정과 고유 치수는 예외 목록으로 남긴다.
**주의:** [C]는 값 축(색→크기→굵기→…)만 하나씩 정리하고 위계를 세우지 않았다. 그래서 화면 단위 문제가 모두 "남은 것"으로 밀렸다.

### ✅ 1-1 레이아웃·반응형 기준

**결정:** 1024px(`sm:`)부터 데스크톱 틀, 1280px(`xl:`)부터 서브내비. 읽기 폭 640px(14px 본문 약 62자) — HTML 본문의 문단·목록·제목과 긴 문단이 여기서 멈춘다. 본문 영역은 모바일·데스크톱 모두 상한 없음(메인 띠가 끝까지 차고 표·카드·달력이 넓게 쓴다). 폭 임의값 42곳을 스케일 값으로.
**남은 확인:** 목록·검색 결과·인물의 `max-w-3xl`(768)은 3-3에서 역할을 다시 본다.
**남긴 것:** 영어 모바일 푸터·10-10 참가자 제목의 좁은 화면 넘침(3-2·3-1). 메인 뉴스 캐러셀 카드 수는 `min-[1381px]` 예외.

<details><summary>이전에 본 문제</summary>

- **640~1199px에서 가로 스크롤:** `routes/__root.tsx:129`, `components/layout/RootErrorBoundary.tsx:34`의 `sm:min-w-[1200px]` 때문에 페이지가 1200px로 펼쳐진다.
  - [X] DS-023은 탐색 1200px / 콘텐츠 1024px로 전환 폭을 나눴다.
  - [C]는 `--breakpoint-sm: 64rem`로 바꿨다.
- **데스크톱 전환이 `sm`(640px) 하나뿐이다.** 메인 뉴스 캐러셀만 `max-[1380px]`를 따로 쓴다(`routes/$locale/-components/news/NewsCarousel.tsx:13`).
- **가로 거터가 제각각이다.** `.page-gutter-x`가 있는데도 다음 곳은 따로 쓴다.
  - `PageTitle`·`CategoryPage`·`CategoryGrid`: `px-5 sm:px-25`
  - 헤더·푸터: `sm:px-15`. 푸터 모바일은 `px-6`/`px-5`가 섞여 있다.
  - 메인 `NewsSection`: `sm:pl-[60px] pr-[150px]`
  - [C]는 헤더·푸터 오른쪽 끝을 서브내비에 맞췄다.
- **본문 폭이 제각각이다.**
  - `max-w-[768px]`: `SearchResultList.tsx:93`, `ui/Dialog.tsx:27`
  - `[800px]`: `PeopleGrid.tsx:10`
  - `[780px]`·`[720px]`: `research/groups/index.tsx:114-122`
  - `[960px]`: `CategoryPage.tsx:55`
- **편집 폼 입력 폭에 규칙이 없다.**
  - `max-w-[20rem]`·`[25rem]`·`[30rem]`
  - `w-[25rem]`: `form/TextList.tsx:35`
  - `w-[520px]`: `form/File.tsx:93`
  - `w-[17rem]`·`[21.75rem]`·`[41.5rem]`·`[45rem]`: `ResearchLabEditor.tsx`
- [X] DS-028: 공개 화면·예약은 320px부터, 편집·관리는 1200px부터 확인한다.
- [C] 본문 최대 폭 1200과 서브내비 위치, 레이아웃 그리드를 세웠다. 히어로 가로 배치는 커밋 4개에 걸쳐 고쳤다가 되돌렸다(주의).

</details>

### ✅ 1-2 색 — 면·강조 단계

**결정:** 밝은 면 white·50·100·200, 어두운 면 900·850·800, 크롬 `chrome-bar`·`chrome-menu`(토큰 추가). 팔레트 밖 hex 16곳을 가까운 단계로(ΔE 1 안팎, 푸터 포함). 주요 글자 950(800·900 34곳), 밝은 면 400 글자 → 500(정보)·300(비활성), 보조 버튼 글자 600, 정보 링크 #2867cf+항상 밑줄. 비교판 `.ds-review/1-2-색/index.html`.
**남긴 것:** 이미지 팝업 버튼 호버·눌림(#ff7b34·#f55a00, 눈에 보이는 변화 → 2-4에서 사진으로), 컴포넌트·아이콘의 400(2-2·2-3·1-6), 달력 강조 배경 #fff5f0, 라디오 그림자 hex(1-5), SVG 자산 색(1-6).

<details><summary>이전에 본 문제</summary>

- **어두운 면 hex 7종.** [C]는 이름만 붙이고, 800과 850을 합칠지는 미결로 남겼다.

  | hex | 쓰는 곳 |
  |---|---|
  | `#2D2D30` | 모바일 상단 바 `layout/Header/index.tsx:7` |
  | `#323235` | 왼쪽 내비·모바일 메뉴 `LeftNavSidebar.tsx:23`, `MobileNavList.tsx:26` |
  | `#1f2021` / `#1F2021` | 내비 펼침 패널·모바일 상세 `LeftNavDetail.tsx:13`, `MobileNavDetail.tsx:16` |
  | `#202020`·`#212121` | 메인 공지 `NoticeSection.tsx:28,42` |
  | `#262728` | 푸터 모바일 `Footer/index.tsx:39` |
  | `rgb(30,30,30)` | 푸터 아랫단 `Footer/index.tsx:40`. 850과 같은 값 |

- **결정(이번 세션):** 크롬 `#2D2D30`과 `#323235`는 구분을 유지한다.
- **주황 변형.** 같은 메인 화면에서 더보기 색이 공지는 `orange-dark`, 뉴스는 `#E65615`로 다르다.
  - `#E65615`: 뉴스 더보기 `NewsSection.tsx:18`, 캐러셀 점 `NewsCarousel.tsx:147`
  - `#ff7b34`·`#f55a00`·`#ffc38f`: `ui/ImageModal.tsx:144`
  - `#ff6914cc`: 예약 블록 `CalendarColumn.tsx:96`
  - `#e65817`·`#fff5f0`: `ui/calendar.css`
- **토큰 값을 hex로 다시 적은 곳:** `CategoryPage.tsx:55,64`(`!text-[#f5f5f5]`, `!text-[#a3a3a3]`), `CornerFoldedRectangle/style.module.css`, `form/Radio.tsx:18`(`shadow #ff6914`), `ui/calendar.css`(`rgb(212 212 212)`).
- **주요 글자색이 섞여 있다.** body는 950, 컴포넌트는 주로 800이고 900도 쓴다. sonner 토스트 설명문은 `#3f3f3f`다.
- **링크.** 토큰 `--color-link`는 `#3c7be4`이고 5곳만 쓰며, 호버해야 밑줄이 생긴다. `reservations/introduction.tsx:29,33`에는 오타 `#3c7de4`가 있다. [X] DS-011은 `#2867cf`에 밑줄을 항상 보이게 해서 대비와 식별을 개선했다.
- **주황이 너무 많은 역할을 맡는다.** 선택·호버·필수·안내문·배너가 모두 주황이다.
  - 호버 주황과 선택 주황이 구분되지 않는다: `SubNavbar.tsx:74` vs `:81`, `Pagination.tsx:144` vs `:147`
  - 카테고리는 선택과 호버가 같은 색이다: `CategoryGrid.tsx:93-94`
- **목록 줄 상태가 한 계열에 섞여 있다.** 줄무늬 50/100, 선택 100, 비공개 200(`NoticeListRow.tsx:38-39`).
- **`CornerFoldedRectangle` 버그:** `black` 테마가 실제로는 `#fafafa`다. `.folding:hover`의 `var(--neutral-100)`은 v4 변수 이름과 달라 적용되지 않는 것으로 보인다(`style.module.css:14-17,76`).
- **SVG 자산의 hex 205개.** [C]는 `#E65615`·`#1E1E1E` 오타 SVG와 죽은 자산을 찾았다.
- **사용자 결정 [X] DS-007:**
  - 주황 `#ff6914`의 hex는 바꾸지 않는다("디자인 분위기를 크게 바꾼다").
  - "ㅇㅇ 주황 배경에 흰색 글씨는 유지하자". 대비 2.88:1은 알려진 한계로 둔다.
- **사용자 결정 [X] DS-004·014:** 주요 실행은 짙은 중립색 `#404040`(호버 `#737373`)이다. "A 좋아".
- **[X] DS-013:** white·50 바탕의 오류 글자는 `red-600`을 유지한다.

</details>

### ✅ 1-3 글자 — 정보 단계

**결정:** 역할 클래스 `type-*` 9개(page-title·headline·section·item·body·ui·label·meta·caption). 크기 12·13·14·16·20·24·32, 굵기 400·500·700(600은 700으로), 줄간격은 본문(14/28)에만, 나머지 역할은 1.2(사이트 기본값 — 컴포넌트 글자가 부풀지 않게. 사용자 요청). 버튼 높이는 h-*. 메인 섹션 제목 24. 앱 120개 파일 적용, 크기·굵기·줄높이 클래스는 카테고리 대제목만 남음. `titleSize` 속성 삭제. 전후 캡처 `.ds-review/1-3-글자/`.
**추가 확인:** 적용 중 추가한 `type-ui`·`type-headline`은 화면 확인으로 확정. 12px(`type-caption`)은 없애고 13px로. 표형 목록 행 제목은 `type-item sm:type-ui`. 메인 중요 안내 카드는 모바일 두 줄·카드 늘어남.
**화면별 확인:** ✅ 메인 · ✅ 공지 목록 · ✅ 교과목 · ✅ 교수진 · ✅ 공지 상세 · ✅ 새 소식 · ✅ 세미나 · ✅ 검색 · ✅ 예약 · ✅ 연구실 · ✅ 연구 그룹 · ✅ 교직원 · ✅ 소개(카테고리) · ✅ 인사말 · ✅ 학부 개요 · ✅ 진로 · ✅ 장학 · ✅ 졸업 규정
**남긴 것:** tracking(자간)은 건드리지 않음. 메인 링크 섹션의 배치 위계는 3-6.

<details><summary>이전에 본 문제</summary>

- **크기가 16단계다.** 11~36px에 64·120·160px까지 있다.
  - 같은 값을 다르게 적었다: `text-sm`/`text-[13px]`, `text-[15px]`/`[0.9375rem]`, `text-[20px]`/`[1.25rem]`, `text-2xl`/`text-[24px]`.
  - `text-4xl`은 Tailwind 기본값이 그대로 남은 것이다(`Footer/index.tsx:147`).
- **콘텐츠 섹션 제목이 8가지다.**
  - 16/700 `PeopleInfoList.tsx:13`
  - 16→24 `SelectionTitle.tsx:16`
  - 20 `ScholarshipList.tsx:22`
  - 18 `degree-requirements/index.tsx:54`
  - 17 `CoursesPage.tsx:106`
  - 24 `ReservationCalendar/index.tsx:26`
  - 16/600 `about/overview/index.tsx:96`
  - `CareerStat.tsx:33`
- **위계가 뒤집힌 곳.**
  - 교수 이름(18/700, `PeopleGrid.tsx:69`)이 섹션 제목(16/700)보다 크다.
  - 메인 링크 섹션 제목(14/500 회색, `LinkSection.tsx:10`)이 그 안의 항목(`LinkRow.tsx:28`)보다 약하다.
  - 상세 글 제목(20/600, `notice/$id.tsx:63`)이 세미나 연도 헤더(20/700, `seminar/index.tsx:74`)보다 약하다.
  - 폼의 Fieldset legend(14/500)와 Section 제목(14/600)이 거의 같고, 검색 라벨(14/700, `SearchBox/Input.tsx:19`)이 오히려 더 굵다.
- **목록 항목 제목이 데스크톱에서 13·14·16·18px로 제각각이다.** 모바일이 데스크톱보다 더 굵은 역전도 있다: `NoticeListRow.tsx:115`, `CourseList.tsx:68`, `ResearchLabRow.tsx:66`.
- **상세 제목:** 대부분 20/600인데 채용 공고만 30/700이다(`faculty-recruitment/index.tsx:52`).
- **보조 정보**(날짜·작성자·조회수): 12·13·14px, 색도 500·800·상속이 섞여 있다.
- **표 헤더 4종:** `notice/index.tsx:87`(15px), `research/labs/index.tsx:62`, `CourseList.tsx:43`, `AdminTable.tsx:49`.
- **줄높이 19종, 자간 임의값 7종.** `--text-*--line-height: initial`이라 크기 클래스를 붙이면 행간이 `normal`로 돌아간다.
- **클래스 충돌.** 같은 요소에 서로 다른 값이 함께 붙어 있다.
  - `PageTitle.tsx:29+47`: `text-2xl`/`text-lg`와 `text-[24px]`
  - `ui/Button.tsx:57-60+84`: `font-normal`과 `font-medium`
- **결정(이번 세션):** 표형 목록(공지·연구실·교과목·관리자)의 행 제목은 본문 단계, 피드형(새 소식·세미나·검색)은 항목 제목 단계. [C]는 피드형까지 500으로 내려 이 결정과 맞지 않는다.
- **사용자 결정 [X] DS-016:** 본문 14px/줄높이 28px, 글 제목 20/600, 보조 정보 13px를 유지한다. 16px 확대는 적용했다가 철회했다("명확한 이유가 없는 변경은 하지 않는다").
- [C] 굵기 넷 중 둘이 같은 일을 해서 셋으로 줄였고, 크기마다 행간을 짝지었다.

</details>

### ✅ 1-4 간격 — 리듬

**적용:** 단계 4·8·12·16·24·32·48·64·128(페이지 끝 데스크톱). 앱 약 110개 파일. Fieldset/Section 간격 속성 삭제(필드 24·필드명 아래 8·묶음 48·묶음 제목 아래 16). 페이지 위 32/48·끝 64/128. 남은 단계 밖 값은 거터(`px-5`·`mr-25`·`pl-59`)와 그래픽 보정뿐. 메인·카테고리·서브내비 높이는 3-6·3-2. 전후 `.ds-review/1-4-간격/`.
**화면 확인 중 추가:** 검색·필터와 목록 사이 48, 모바일 목록 행 제목 아래 8, 검색 결과 구분선(위아래 24)과 결과 개수 머리말 선, 피드형 목록 구분선 200. 진로 화면 조정은 사용자가 원래대로 되돌림.
**화면별 확인:** ✅ 새 소식 · ✅ 세미나 · ✅ 공지 목록 · ✅ 공지 상세 · ✅ 연구 그룹 · ✅ 연구실 · ✅ 교과목 · ✅ 교수진 · ✅ 교직원 · ✅ 검색 · ✅ 예약 · ✅ 진로 · ✅ 인사말 · ✅ 학부 개요 · ✅ 장학 · ✅ 졸업 규정 · ✅ 소개(카테고리) · ✅ 메인

<details><summary>이전에 본 문제</summary>

- **목록 행 간격 6종.**
  - 공지 `sm:h-11 py-2.5`(`NoticeListRow.tsx:36`)
  - 연구실 `sm:h-14`
  - 새 소식 `gap-5`+`pb-5`
  - 세미나 `py-[1.2rem]`
  - 검색 `gap-7`
  - 관리자 `py-3`
- **목록 위아래 여백:** 공지 `mt-9 mb-10`, 새 소식·세미나 `mt-10 mb-8`. 목록 아래 액션 줄은 `mt-[40px]`, `mt-12`, `mt-16`(`PostFooter.tsx:51,70`).
- **페이지 하단 여백 7종.**
  - `[150px]` PageLayout
  - `pb-36` 상세
  - `[220px]` `AdmissionsPageContent.tsx:129`
  - `[100px]` `research/centers/index.tsx:87`, groups
  - `[7.88rem]` ContentSection
  - `pb-45` 카테고리
  - `mb-32` 인물 상세
- **제목 아래 여백:** 기본 `mb-6 sm:mb-11`, 개인정보 `mb-9`(`reservations/privacy-policy.tsx:34`), 검색 `mb-11`.
- **폼 필드 간격 옵션 8종.** `form/Fieldset.tsx`와 `form/Section.tsx`의 SPACING_MAP은 서로 복붙이다.
- **10px을 세 가지로 적는다.** `px-2.5`, `px-[.62rem]`, `pl-[.625rem]`(File·Image·NoticeEditor vs TextList·DatePicker). `apps/web/CLAUDE.md`에 "합의 대기"로 남아 있다.
- **드물게 쓰는 소수 단계:** `pt-0.75`, `pt-2.75`, `px-3.25`, `mb-3.5`, `p-4.5`, `gap-6.5`, `pl-12.5`, `pl-59`, `mx-31`, `mt-22`, `pb-45`.
- **메인은 거의 전부 임의 px다:** `GraphicSection.tsx`, `ImportantSection.tsx`, `LinkSection.tsx`, `NewsCard.tsx`.
- `ContentSection.tsx:20,22`의 `default`와 `overviewTop`은 값이 완전히 같다.
- [C] 세로 리듬안 `64·88·150`을 세웠지만 적용하지 않았다.
- **1-3에서 줄높이로 만들던 여백이 사라진 곳:** 원래 제목에 큰 줄높이(`leading-loose`·`leading-8`·`leading-10`)를 줘서 위아래 공백을 만들었는데, 컴포넌트 글자 줄높이를 1.2로 되돌리며 줄었다. 연구 그룹 '연구실' 소제목(`research/groups/index.tsx:128`, 원래 20px·줄높이 2 → 지금 16px·1.2), 연구 그룹·센터 제목(`groups:110`, `centers:142`, `SelectionTitle`), 교수진 섹션 제목(`PeopleInfoList`·`PeopleContactList`, `leading-8`), 장학 제목(`leading-10`), 학회 목록 제목(`top-conference-list`, `leading-8`). 제목 아래 여백 규칙으로 되살린다.

</details>

### ✅ 1-5 모서리·그림자·선

**결정:** 모서리 셋(없음·컨트롤 2px `rounded-xs`·알약 `rounded-full`), 그림자는 떠 있는 층 하나(`shadow-overlay`), 인물 사진 그림자 제거, 선 1px 기본·2px 강조. 비교판 `.ds-review/1-5-모서리/index.html`.
**남긴 것:** 메인 뉴스 카드 그림자(3-6), 교과목 카드 뒤집기 그림자(3-7), 라디오 링 그림자 hex(2-2), 모달 위 주황 3px 선(2-4), 메인 링크 행 5px 바(3-6). 조사 때 오기로 본 Dialog `-top-[48%]` 두 개는 열림/닫힘 애니메이션이라 오기 아님.

<details><summary>이전에 본 문제</summary>

- **모서리.**
  - 1px(Button 3종), 2px(입력), 4px(대부분의 컨트롤·상자)이 섞여 있다.
  - `rounded-[4px]`(ImageModal)은 토큰으로 쓸 수 있는 값이다.
  - md·lg·xl은 각각 한 곳에서만 쓴다.
  - 알약 `rounded-[1.875rem]` 3곳, 타임라인 `2xl`.
- **그림자.**
  - 임의값 2종(`NewsCard`, `ImageModal`)과 `shadow-lg`(AlertDialog)가 있다. Dialog는 그림자 대신 주황 `border-t-3`을 쓴다.
  - `CourseCard`의 inset 그림자는 앞면과 뒷면 값이 다르다.
  - 인물 사진은 `drop-shadow`를 쓴다.
- **선.** `border-t-3`와 `border-t-[3px]`가 같은 값이다(`ui/Dialog.tsx:27`, `AddReservationModal.tsx:51`). 세미나 연도 제목 밑줄은 `border-b-2`, LinkRow 왼쪽 바는 `border-l-[5px]`이다.
- **오기.**
  - `ui/Dialog.tsx:27`, `ui/AlertDialog.tsx:35`: `-top-[48%]`이 중복으로 들어 있다.
  - `GraphicSection.tsx:17`: `sm: hrink-0`처럼 공백이 끼어 적용되지 않는다.
- [C] 모서리를 역할 셋으로 줄이고 그림자를 토큰으로 만드는 도중에 멈췄다.

</details>

### ✅ 1-6 아이콘

**적용:** lucide 한 벌, 크기 1.2em·선 1.5px 고정(app.css 공통 규칙), 직접 그린 SVG 16개 교체·삭제, 아이콘 버튼 20px·클릭 24px, 정렬 보정 제거, 헤더 검색 호버·연구실 자료 색. 전후 `.ds-review/1-6-아이콘/`.
**확인:** 전체 비교판으로 한 번에 확인(사용자). 선 굵기는 1.5px 고정 → 크기에 비례로 바꿈(고정이면 13px 글자보다 진해 보임).
**메모:** Button 에 `className` prop 추가(헤더 검색 호버를 `hover:text-neutral-700!` 로 덮음) — 2-1 버튼에서 variant 로 정리.
**후속(2-2 중):** lucide 0.562 → 1.48. 체크박스 체크가 홈페이지보다 작던 원인(1.x 에서 체크 경로가 커짐). 모양이 바뀐 아이콘 4개(square-check·circle-check·calendar·bookmark) — `.ds-review/1-6-아이콘-lucide1/icons.html`.

<details><summary>이전에 본 문제</summary>

- [C] 직접 만든 SVG 34개 중 20개가 아이콘이었고 모두 lucide로 바꿨다. 크기는 옆 글자에 맞춘 12·16·24, 색은 `currentColor`. 상하 중앙이 어긋난 곳 6곳을 찾았다.
- **헤더 검색 호버가 흐려진다.** `#e5e5e5` 바 위에서 흰색이 되어 대비가 약 1.26:1이다(`HeaderSearchBar.tsx:50`의 quiet 호버). [X] DS-017은 기본 `#737373`, 호버 `#404040`으로 고쳤다.
- **검색 버튼 클릭 영역이 좁다.** 입력칸에 붙은 버튼이 20×30px다. [X] DS-018은 헤더·세미나·모바일 검색을 24px로 넓혔다.
- **연구실 PDF·영상 아이콘이 흐리다(`neutral-400`).** [X] DS-021은 `#737373`으로 바꿨다.

</details>

### ✅ 1-7 그래픽

**결정:** 원과 선 = 연결·구분(클릭 없음, 밝은 면 주황·어두운 제목 영역 회색, 내비 현재 위치는 예외), 접힌 모서리 = 선택 탭·정보 요약 두 곳만, 메인 그래픽은 메인 전용. 테마 이름 black → summary, 안 쓰는 unfolding 삭제(화면 변화 없음).
**남긴 것:** 연구 그룹·장학의 직접 그린 원 목록 → 3-3 공용 컴포넌트.

<details><summary>이전에 본 문제</summary>

- **원과 선(`ui/Nodes.tsx`, 5종)을 쓰는 곳:** 제목 옆 장식(PageTitle), 서브내비 세로선, 목록·상세 구분(`notice/$id.tsx:90` 등), 검색박스, 연구실 노드.
  - 연구 그룹(`research/groups/index.tsx:139`)과 장학(`ScholarshipList.tsx:34`)은 Node를 쓰지 않고 같은 원을 직접 그린다.
- **접힌 모서리는 두 곳에서만 쓴다.**
  - 선택 탭 `SelectionList.tsx:37-62`: 주황 = 선택
  - 연구실 정보 `labs/$id/index.tsx:109`: 어두운 색 = 정보 묶음
  - `unfolding` 애니메이션과 일부 크기 조합은 쓰이지 않는다.
- [X] 원·선은 경로·연결·구분을 뜻한다. 선이 있다고 조작할 수 있다는 뜻은 아니다. "접힌 모서리 = 선택됨" 같은 전역 규칙은 두지 않는다.
- **[C] 시각 언어 절.**
  - 메인의 원·막대 그래픽은 SNUCSE를 ASCII로 쓴 것이다.
  - 선 자체에 클릭 동작을 두지 않는다.
  - 주황 선은 밝은 본문에, 회색 선은 어두운 제목 영역에 쓴다.
- **그대로 두는 것:** 메인 그래픽 hex 약 60개(`MainGraphic.tsx`)와 `background.svg`의 `#1b1b1b`는 그래픽 전용이다.

</details>

---

## 2. 컴포넌트

**목표:** 같은 역할의 부품을 한 벌로 만든다. 부품이 기반 단계만 쓰게 한다.
**끝나면:** 조사에서 여러 종이던 것이 1종이 된다. 페이지에서 공용 부품을 흉내 낸 코드가 없다.

### ✅ 2-1 버튼

**결정:** 역할은 행동의 종류로 — primary(짙은 회색 채움: 추가·새 글·저장·게시·예약, 확인창의 실행) · secondary(연한 회색: 편집·취소·목록·삭제) · text · textInverse. 주황 채움 없음. 호버·누름은 중간 회색 쪽으로 한 단계씩(주요 700→600→500, 보조 100→200→300), 글자형은 주황→짙은 주황. 처리 중 글자(`pending`·`pendingLabel`, 평소엔 원래 폭), 크기 md·sm 둘, `iconOnly` 정사각형. `className` 통로 삭제. 버튼 줄은 오른쪽 정렬·간격 12·주요가 맨 오른쪽, 폼의 삭제는 왼쪽 끝. 버튼 글자는 줄바꿈하지 않고 자리가 모자라면 버튼 줄이 내려간다(졸업생 진로 줄, 예약 툴바는 모바일 두 줄).
**남긴 것:** 교수 정렬·필터 알약 → 2-3, 이미지 팝업 버튼(호버 `#ff7b34`·`#f55a00` 전후 사진 약속) → 2-4, 날짜·파일 선택 → 2-2. 영어 예약 페이지 390에서 가로 넘침 56px(툴바 아님) → 3-2.
**화면별 확인:** `.ds-review/2-1-버튼/buttons.html`(화면 + 바뀐 버튼만), `compare.html`.

<details><summary>이전에 본 문제</summary>

- **"추가" 버튼이 3종이다.**
  - 주황 primary: 연구실·시설·연도·동아리·과목·예약
  - 짙은 회색 neutral: `people/faculty/index.tsx:125`, `emeritus-faculty:50`, `staff:51`, `news:70`, `seminar:97`, `AdminFeatures:101`
  - 인라인 알약: `TimelineViewer.tsx:66-68`
- **"편집" 버튼.** 대부분 secondary인데 `faculty-recruitment/index.tsx:43`은 neutral, `AdminFeatures:91`은 primary다.
- **"삭제" 버튼.** `form/Action.tsx:46`은 neutral이고 `PostFooter.tsx:77`, `CompanyRow.tsx:108`, `CourseDetailModal.tsx:96`은 secondary다. 위험 행동을 나타내는 색은 없다.
- **제출에 secondary를 쓴 곳:** `AddCourseModal.tsx:183`.
- **상태가 부족하다.**
  - primary만 호버가 없다. [X] DS-037은 `#e65817`을 넣었다.
  - active와 focus-visible이 없고, 비활성은 `opacity-40`뿐이다.
  - quiet은 주석에 "밝은 표면"용이라고 적혀 있지만, 실제로는 대부분 어두운 모바일 내비에서 쓴다.
- **처리 중 표시가 없다.** [X] DS-036 "A ㄱㄱ": 버튼 안 글자를 "저장 중… / 게시 중…"으로 바꾼다.
- **Button을 쓰지 않고 직접 만든 버튼:** `CalendarToolbar.tsx:148`, `NoticeEditor.tsx:112`, `CourseToolbar.tsx:59,69`, `SeminarSearchBar.tsx:47`, `SearchBox/Input.tsx`, `TimelineViewer.tsx:198`, `CourseEditor.tsx:72`, `ImageModal.tsx`.
- [C] 버튼에 상태를 넣고 초점 링을 하나로 모았다.

</details>

### ✅ 2-2 입력·폼

**결정:** 보이는 부품은 `ui/` 한 벌(Checkbox·새 Radio·Dropdown), `form/`은 react-hook-form 연결만 — CLAUDE.md "통합 금지" 삭제. 입력 칸 34px·테두리 300·흰 바탕·여백 12(`ui/field.ts`), 덮어쓰기 prop(maxWidth·bgColor·borderStyle·height·width·buttonClassName·textCenter·className) 삭제, 폭은 `size` sm 80·md 320·lg 480·full. 체크박스 SquareCheck·라디오 Circle+50% 점, 켜짐 neutral-700·꺼짐 500(주황은 어색해서 회색으로 — 입력 값은 "행동은 회색"). 드롭다운 칸 폭 = 가장 긴 항목, 목록은 떠 있는 층·항목 34. 오류는 필드 아래 + 버튼 줄 옆 개수. 첨부 고르기는 보조 버튼, 지우기 X, 파일명 말줄임. 달력 글자 단계. 폼 버튼 줄은 마지막 필드와 48. lucide 1.48 로 올림(체크가 작던 원인).
**남긴 것:** 한글/English 전환 탭 → 2-3. 모달 안 폼 배치 → 2-4.
**화면별 확인:** `.ds-review/2-2-입력/fields.html`(화면 + 바뀐 입력 칸), `compare.html`. 예약·교과목 모달은 캡처 없음(직접 열어 확인).

<details><summary>이전에 본 문제</summary>

- **`ui/`·`form/` 분리를 다시 판단한다.** 사용자: "꼭 나눠야 할 필요는 없어". 결정하면 `apps/web/CLAUDE.md`의 "통합 금지"도 고친다.
  - Checkbox: `ui/Checkbox`와 `form/Checkbox`가 거의 같다. form 쪽에 `tags &&` 버그로 보이는 조건과 id 충돌 가능성이 있다.
  - Dropdown: `ui/Dropdown`은 한 곳에서만 쓰고 키보드를 지원한다. `form/Dropdown`은 방향키가 안 되고 닫혀도 DOM에 남는다([X] Q-15).
- **`form/Fieldset`과 `form/Section`은 간격 맵이 복붙이다.**
- **컨트롤 높이:** `h-7.5`·`h-8`·`h-7`이 섞여 있다. [C]는 7가지를 3가지로 줄였다.
- **필드 오류:** 하단 요약에만 나온다. [X] DS-027은 해당 필드 바로 아래에도 표시했다.
- **첨부.**
  - 긴 파일명이 넘친다. [X] DS-031은 한 줄 말줄임으로 처리했다.
  - 삭제용 원형 X의 색은 [X] DS-032에서 정했다.
  - 파일 목록 행은 `border-dashed`다.
- **텍스트 입력 초점.** 사용자: "필수가 아니라면 지난번에 넣었던것도 빼면 안돼?" 그래서 외곽선 없이 캐럿만 둔다([X] DS-012).
- **모달 안의 폼 액션 줄을 직접 만든 곳:** `AddCourseModal.tsx:179`, `AddReservationModal.tsx:193`, `CourseEditor.tsx:130`. `Form.Action`은 `gap-3`인데 여기는 `gap-2`이고, 제출 버튼 variant도 세 곳이 모두 다르다.
- **날짜 선택:** `form/DatePicker`, `ui/Calendar`, `ui/calendar.css`. 달력 강조색이 CSS에 `#e65817`·`#fff5f0`로 따로 박혀 있다(1-2 참고). 예약 모달에서는 날짜 팝오버가 넘친다(2-4 참고).
- **범위 밖:** 모바일 편집 최적화([X] DS-003, 사용자: "편집 관리는 행정실에서 사용하는데 모바일에 대한 니즈는 없었어").

</details>

### ✅ 2-3 선택·태그

**결정:** 단일 선택은 하는 일로 두 종류 — 알약(`PillGroup`, 거르기·정렬: 교수 정렬·교과목 정렬·메인 공지)과 글자 토글(`TextToggle`, 보기 바꾸기: 교과목 목록형/카드형·편집 언어). 처음엔 알약 하나로 싹 통일을 제안했으나 "너무 싹 통일"이라 하는 일로 나눔. 밑줄 탭은 편집 화면 전용이라 따로 두지 않음. 알약 높이 30·좌우 12·사이 12(버튼보다 한 단계 가볍게 — 34로 맞췄더니 메인이 부해 보여서), 밝은 면 고른 것 neutral-700, 어두운 면(메인 공지)만 주황. 태그 높이 24, `solid` 삭제, 교과목 카드 복붙을 `Tag` 로.
**남긴 것:** 학사 연혁 연도 원 → 3-7. 목록 태그 열 영어 겹침 → 3-3. 카테고리 선택·호버 색 → 3-6. 푸터 제작진 이름표·`/en` 푸터 긴 링크 넘침 → 3-2.
**화면별 확인:** `.ds-review/2-3-선택/selection.html`(바뀐 화면만), `compare.html`.

<details><summary>이전에 본 문제</summary>

- **단일 선택 컨트롤이 6종이다.**
  - 메인 공지 알약: `NoticeSection.tsx:22-30`, `#202020`
  - 교수 정렬 알약: `people/faculty/index.tsx:25`
  - 교과목 정렬: `CourseToolbar.tsx`에서 Tag를 버튼으로 쓴다. radio가 아니라 CLAUDE.md 규칙 위반이다.
  - 교과목 보기 방식: 텍스트 토글
  - 언어 선택: `form/LanguagePicker`의 밑줄 탭
  - 타임라인 연도
- **태그 구현이 셋이다:** `ui/Tag.tsx`(`text-[13px] h-[26px]`), `CourseCard.tsx:121`(복붙), `Footer/index.tsx:179`.
- **영어 화면에서 넘친다.**
  - 메인 공지 필터가 390px에서 넘치고, 공지 태그 열이 겹친다([X] DS-024).
  - 통합검색 태그의 80px 열이 겹친다([X] DS-025).
- **카테고리 항목은 선택과 호버가 같은 색이다.**

</details>

### ✅ 2-4 모달

**결정:** 판 한 벌(`ui/dialogStyle.ts`) — 흰 바탕·위 주황 3px·그림자, 가림막 검정 50%+흐림, 안 여백 24/32, 닫기 X 텍스트 버튼. 제목은 판이 20/700 으로 그림(`hideTitle` 은 상세·팀 소개). 크기 `size` 확인 400·폼 560·넓게 768, 모바일은 화면-32. 확인창 실행 버튼은 하는 일(나가기·삭제), 닫기 X 없음. 이미지 팝업: 자세히 보기는 회색(neutral-700 — 포스터 색이 매번 달라서. 주황 B안으로 정했다가 바꿈), 다시 보지 않기는 판 밖 흰 글자·호버 주황. 예약 모달 모바일 넘침(고정 폭 352 입력) 해결, 날짜 이름을 모바일에서 위로(달력 팝오버가 판 안에).
**남긴 것:** 없음. 로컬에 예약 1건·이미지 팝업 1건을 만들어 찍었다.
**함께 고침:** 2-2 회귀 — 폼 체크박스가 제출 전 검사를 안 해 예약 동의가 isValid 에 반영되지 않았다(별도 fix 커밋).
**화면별 확인:** `.ds-review/2-4-모달/compare.html`(모달 6종 1440·390).

<details><summary>이전에 본 문제</summary>

- **오버레이가 3곳에 복붙돼 있다.** 판 색은 Dialog가 `neutral-50`, AlertDialog·ImageModal이 white다. 구분도 그림자와 `border-t`로 갈린다.
- **Dialog 헤더 3가지:** `AddCourseModal.tsx:76`(h4, 크기 xl, 굵기 700, 색 700), `AddReservationModal.tsx:55`(h2), `ReservationDetailModal.tsx:103`.
- **ImageModal.**
  - 버튼 색이 하드코딩돼 있고 체크박스를 직접 만들었다.
  - 하단 버튼의 초점 표시가 잘린다([X] DS-033).
  - 닫기 버튼을 호버하면 글자가 흐려진다([X] DS-034).
- **AlertDialog:** 작은 화면에서 버튼 글자가 '취/소'처럼 한 글자씩 끊긴다([X] DS-039).
- **예약 모달.**
  - 390px에서 가로로 넘친다([X] DS-026).
  - 날짜 팝오버가 320·360px에서 넘친다([X] DS-029).
  - 예약 상세가 320px에서 넘친다([X] DS-030).

</details>

### ✅ 2-5 검색 입력

**결정:** 검색 칸은 `ui/SearchInput` 한 부품(모양·돋보기·useId, 실행은 감싸는 form). 밝은 면 = 입력 칸 한 벌(34·테두리 300·흰·폭 320), 이름은 칸 위(검색 상자) 또는 자리표시(세미나). 헤더 = 채움 칸 neutral-100·34·폭 216. 모바일 메뉴의 전체 화면 검색은 밑줄 칸 그대로(채움 칸을 넣어 보니 너무 달라짐). 정의 없는 `autofill-bg-*` 클래스 삭제.
**화면별 확인:** `.ds-review/2-5-검색/search.html`.

<details><summary>이전에 본 문제</summary>

- **3종이다.**
  - `HeaderSearchBar`: `bg-neutral-200 w-54`
  - `SearchBox/Input`: white
  - `SeminarSearchBar`: `bg-neutral-100 w-60`, 로직도 따로 있다
- **`id="search"`가 하드코딩돼 있어 겹칠 수 있다.**

</details>

### ⬜ 2-6 토스트

<details><summary>이전에 본 문제</summary>

- Sonner 소스를 `components/ui/sonner/`에 복사해 쓰고 있다(`styles.css` 724줄). 설명문 색 `#3f3f3f`는 팔레트 밖이다.
- 호출은 `toast.success` 71곳, `toast.error` 4곳, `toast.info` 1곳이다. 성공 문구가 71가지인데 문구 규칙이 없다(3-8 참고).
- [X] DS-038에서 예약 성공 문구를 '예약을 취소했습니다.'/'Reservation canceled.'로 맞췄다. 당시에는 Sonner 내부를 범위 밖으로 뒀지만, 이번에는 포함한다(사용자: 이전에 뺀 건 너무 오래 붙들어서였다).

</details>

### ⬜ 2-7 에디터

<details><summary>이전에 본 문제</summary>

- SunEditor를 `form/html/HTMLEditor.tsx`로 감싸 쓴다. 겉 스타일은 `suneditor.override.css`(프레임 채우기)와 `minHeight: '400px'`뿐이다.
- 같은 공지에 명시한 18px가 뷰어에서는 18px, 편집기에서는 14px로 보인다([X] Q-09, 당시 보류).
- 뷰어와 편집기가 같은 본문 CSS(`components/ui/assets/suneditor-contents.override.css`)를 쓴다. 기본 서체 연결([X] DS-006)은 3-5에서 정하고, 여기서는 편집기에서도 똑같이 보이는지 확인한다.
- 툴바 구성(`HTMLEditor.tsx:55-58` 등)과 편집기의 테두리·높이가 다른 폼 컨트롤과 맞는지.
- 붙여넣기 정리와 CSP 관련 동작은 기능 영역이라 건드리지 않는다(`apps/web/CLAUDE.md`).

</details>

---

## 3. 패턴

**목표:** 부품을 조합한 화면 단위 규칙을 정하고 기존 화면을 거기에 맞춘다. 통일감이 가장 크게 드러나는 단계다.
**끝나면:** 목록·상세·메인·카테고리 화면이 페이지의 처방대로 보인다. 복붙이 없다.

### ⬜ 3-1 페이지 틀·섹션 제목

<details><summary>이전에 본 문제</summary>

- **PageLayout의 padding이 4종이다.** `ContentSection`은 그 패딩을 다시 구현하고 있다.
- **섹션 제목 공용 컴포넌트가 없다.** `SelectionTitle`, 그 복제본(`research/centers/index.tsx:142`), `research/groups/index.tsx:111`의 h2, `about/directions/index.tsx:89`의 h4가 따로 있다.
- **긴 제목이 넘친다.** 10-10 참가자 `Participants(Professors)`가 320·390px에서 문서 폭을 412px로 만든다. [X] DS-040은 괄호 앞에서 줄을 바꿨다.
- **PageLayout으로 감싸지 않은 곳:** `academics/$studentType/courses.tsx`, `admissions/.../index.tsx`.

</details>

### ⬜ 3-2 내비게이션·셸

<details><summary>이전에 본 문제</summary>

- **1-3에서 breadcrumb을 12 → 13px로 키운 뒤 한국어 390px에서도 두 줄이 된다**(예약 `시설 예약 > 세미나실 예약 > 301-417 (20석)`, 필요 폭 242px, 오른쪽 선 그래픽이 나머지 차지).
- **breadcrumb이 한 줄 flex라서 영어 320px에서 넘친다.** 32개 상태 중 13개가 넘쳤다([X] DS-041). 사용자: "텍스트 줄바꿈이 될 때 … 중앙 정렬이 아니라 왼쪽 정렬".
- **모바일 영어 푸터 링크가 넘친다.** [X] DS-022는 열 안에서 줄바꿈하게 했다.
- **내비 겹침 순서가 거꾸로다.** 펼침 패널(`#1f2021`)이 바탕 사이드바(`#323235`)보다 어둡다.
- **`SubNavbar.tsx:9-34`:** 항목 수에 따라 높이를 33px 배수로 14종 하드코딩했다.
- [C] 푸터의 `font-light`는 의도가 아니라고 보고 제거했다.

</details>

### ⬜ 3-3 목록·상태 화면

**메모(사용자):** 404·오류 페이지는 대충 만든 것이라 기존 글자 크기·배치를 존중하지 않아도 된다.

<details><summary>이전에 본 문제</summary>

- **결정(이번 세션):** 표형 목록의 행 제목은 본문 단계, 피드형은 항목 제목 단계.
- **목록 헤더 행 6종:** `notice/index.tsx:86`, `research/labs/index.tsx:62`, `ConferenceListTable.tsx:20`, `CareerCompanies.tsx:94`, `CourseList.tsx:43`, `AdminTable.tsx:49`.
- **빈 상태 5종:** `notice/index.tsx:81`, `news/index.tsx:93`, `seminar/index.tsx:63`, `NoSearchResult`, `CareerStat.tsx:27`(한국어 하드코딩).
  - 사용자 [X] DS-035: "2에서는 색만 바꾸자. 문구 추가하니 verbose해보여". 색은 300 → 500으로 바꿨다.
- **줄 상태:** 줄무늬·선택·비공개가 한 계열을 쓴다(1-2 참고).
- **점 링크 목록이 두 곳에 같은 코드로 있다:** `research/groups/index.tsx:139`, `ScholarshipList.tsx:34`.
- 목록 행 간격은 1-4를 참고.
- **페이지네이션:** 선택된 쪽을 굵게+밑줄로 표시한다. 편집 중 비활성 상태는 클릭만 막는다([X] Q-17). `ui/Pagination.tsx`.
- **오류 화면:** `ui/ErrorState`(404·500 전체 화면), `layout/NotFound.tsx`, `layout/RootErrorBoundary.tsx`. 라우트별 오류·대기 화면은 0개라 loader 오류는 전부 500 전체 화면으로 간다. 오류 코드는 주황, 복귀 버튼은 primary(주황)다.
- **로딩 상태:** 공용 컴포넌트가 없다. 검색 결과 목록의 인라인 문구(`SearchResultList.tsx:37`, '검색 결과를 불러오는 중'), 예약 상세의 '불러오는중'(`ReservationDetailModal.tsx:35`)이 전부다.

</details>

### ⬜ 3-4 게시물 상세

<details><summary>이전에 본 문제</summary>

- **공지와 새 소식 상세가 거의 같은 코드다.** `community/notice/$id.tsx:62-110`과 `community/news/$id.tsx:56-100`의 차이는 45줄이다.
- **세미나 상세(`seminar/$id.tsx:71`)에는 메타 블록이 없다.**
- **이전·다음 글(`PostFooter.tsx`)의 여백:** `mt-12`와 `mt-16`이 섞여 있다.
- **첨부 목록(`ui/Attachments.tsx`, 7곳):** 데스크톱 오른쪽 여백이 `sm:pr-[10rem]` 임의값이다(`Attachments.tsx:13`).

</details>

### ⬜ 3-5 읽는 본문·이미지

<details><summary>이전에 본 문제</summary>

- **작성자 본문의 기본 서체가 Pretendard가 아니다**(`components/ui/assets/suneditor-contents.override.css`). [X] DS-006에서 연결했다("ㅇㅇ 좋아").
- **제목 크기 관계가 정해져 있지 않다.** 본문의 기본 h2는 21px, 글 제목은 20px다.
- **표.** 개인정보 표는 320·390px에서 표 영역만 가로로 스크롤된다. [X]는 이대로 두기로 했다. 작성자가 지정한 15·17·19px는 건드리지 않는다.
- [C] 본문 이미지를 글 안에 띄워 두지 않는다.
- **이미지(`ui/Image.tsx`, 15곳):** 자리표시 바탕이 `neutral-200`이다(`Image.tsx:50`). 인물 사진에는 `drop-shadow`가 붙는다(1-5 참고).
- 편집기와의 차이는 2-7에서 다룬다.

</details>

### ⬜ 3-6 메인·카테고리

**메모(1-4 확인 중):** 카테고리 카드 격자 간격 36~40이 넓은 편. 제안: 데스크톱 32, 모바일 가로·세로 24. 비교 이미지로 판단.

<details><summary>이전에 본 문제</summary>

- **메인 섹션 제목이 제각각이다.**
  - 공지 28/600
  - 뉴스 28/500. 데스크톱에서 오히려 가벼워진다.
  - 링크 21/500, 회색
  - 중요 안내 항목(`ImportantSection.tsx:31`)은 18/600이다.
- **메인 공지 색.** 판은 `#212121`, 알약은 `#202020`이다. 더보기 색이 공지와 뉴스에서 다르다(1-2 참고).
- **카테고리 카드 설명이 모바일 11px, 데스크톱 16px다**(`CategoryGrid.tsx:149-152`). 데스크톱에서는 섹션 제목과 크기가 같다.
  - `CategoryGrid`의 light 분기는 쓰이지 않는다.
  - `CategoryPage`는 `text-[32px] sm:text-[64px]` 같은 임의값을 쓴다.
- **메인 간격은 거의 전부 임의값이다**(1-4 참고).
- [C] 메인의 두 띠 안쪽 여백을 64로 맞췄다. 히어로는 1280까지 모바일 배치를 쓰다가 되돌렸다.

</details>

### ⬜ 3-7 고유 화면

<details><summary>이전에 본 문제</summary>

- **예약 달력.**
  - 버튼을 직접 만들었다(`CalendarToolbar.tsx:148`).
  - 예약 블록 색은 `#ff6914cc`이고, 따로 `ui/calendar.css`를 쓴다.
  - 3일 보기와 7일 보기 전환 폭이 정해져 있지 않다. [X] DS-023은 1024px로 정했다.
- **교과목 카드.**
  - 키보드 초점이 가도 화살표가 보이지 않는다([X] DS-019).
  - inset 그림자가 앞면과 뒷면에서 다르다.
  - 설명에 HTML 태그가 그대로 보이는 것은 기능 버그라 범위 밖이다([X] Q-14).
- **학사 타임라인.** `neutral-75`를 여기서만 쓴다. 추가 알약과 펼침 버튼을 직접 만들었다.
- **인물.** 이름이 섹션 제목보다 크다(1-3 참고). 사진에 `drop-shadow`를 쓴다. 상세 화면이 교수용과 명예교수·직원용 2가지다.
- **연구실 상세.** 접힌 패널을 쓰고, 자료 아이콘이 흐리다(1-6 참고).

</details>

### ⬜ 3-8 문구

<details><summary>이전에 본 문제</summary>

- **사용자 결정 [X] DS-005 "ㅇㅇ 좋아":**
  - 버튼은 짧은 행동명, 안내는 차분한 존댓말.
  - 구분이 필요하면 '변경사항 저장', '계속 편집 / 나가기'처럼 쓴다.
  - 저장·삭제·이탈을 '확인'으로 대신하지 않는다.
- **삭제 확인창에 무엇을 삭제하는지 보여 준다**([X] DS-005 후속).
- **예약 용어:** '삭제' 대신 '이 예약만 취소 / 반복 예약 전체 취소'([X] DS-038).
- **장황한 안내를 붙이지 않는다**([X] DS-035).
- **영어 화면에 한국어가 남아 있다.** 관리 필드명과 필터명이다. 번역할지는 범위를 정해야 한다.

</details>

---

## 4. 마무리

**목표:** 머지할 수 있는 상태로 만들고, 문서가 목표를 달성했는지 확인한다.
**끝나면:** E2E가 통과하고, AI가 문서만 보고 판단 질문 없이 화면을 만들고, 이 파일이 지워진다.

### ⬜ 4-1 기준 이미지

- `pnpm e2e --update-snapshots`를 한 번 돌리고 차이를 훑는다. 작업 중에는 E2E를 돌리지 않는다.
- 목록 조회수 마스크 경계의 차이는 원래 있던 것이라 DS와 무관하다([X] READ-REGRESSION).

### ⬜ 4-2 접근성

<details><summary>이전에 본 문제</summary>

- **초점 공통 규칙:** 2px 실선에 간격 2px, 밝은 면에서는 `#404040`, 어두운 면에서는 흰색([X] DS-020). 사용자: "초점시에 어떻게 표시할지는 통일할 필요가 없을까?"
- **초점이 잘리는 곳:** 메인 카드의 바깥 초점이 캐러셀에서 잘린다. 인물 사진 초점도 확인해야 한다([X] PLAN의 마지막 재개 항목).
- **Tab 이동 문제.** 닫힌 드롭다운의 옵션에 Tab이 들어간다([X] Q-15). 페이지네이션의 비활성 버튼이 Tab 대상에 남는다([X] Q-17).
- **대비:** 주황 위 흰 글씨는 기준 미달이지만 유지한다(1-2 참고).
- 사용자: "접근성적인 측면은 가장 마지막으로".

</details>

### ⬜ 4-3 검증

- AI에게 `/design-system`만 주고 새 화면 하나를 만들게 한다. 판단이 필요했던 곳을 페이지에 채운다.

### ⬜ 4-4 정리

- `apps/web/CLAUDE.md`의 디자인 절을 갱신한다: ui/form 규칙, 합의 대기 항목.
- 이 파일을 삭제한다. `.ds-review/`(전후 캡처·비교판)는 지우지 않는다 — 나중에 콘텐츠 만들 때 참고.
