# E2E 커버리지 추적

목표: **모든 라우트 100% 커버리지**. 이 파일이 진행 상태의 단일 출처다. 라우트를 끝낼 때마다 즉시 갱신한다(다른 세션이 이어받을 수 있게).

상태 표기: ✅ 완료 · 🟡 일부 · ⬜ 미착수 · — 해당 없음

표 컬럼: **read** = `read.spec.ts`(비로그인·비변경, ko, 데스크톱 `read`+모바일 `read-mobile` 한 스펙). **flow** = `flow.spec.ts`(로그인 OR 변경, 데스크톱). 옛 smoke/visual 컬럼은 read로 통합됨.

작성 방법은 `CLAUDE.md`의 "확장 가이드"와 "다음 라우트 추가 런북" 참고. 패턴 reference는 `tests/research/labs/`.

## 진행 요약

- **로케일 항상-프리픽스 전환 완료(2026-06-21)**: `{-$locale}`(optional)→`$locale`(required). 모든 페이지가 `/ko`·`/en` 프리픽스, bare 경로는 `__root` beforeLoad가 cookie>Accept-Language로 감지해 `/{lang}` 302 리다이렉트. 근거·세부는 `docs/i18n-url-strategy.md`. **신규 `tests/language.spec.ts` + `language` 프로젝트**(`testMatch: /language\.spec\.ts$/`, flow가 dependency로 read 단계 포함): bare→/ko·/en 감지, cookie>AL 우선순위, 토글+쿠키 persist, /ko no-loop 회귀 가드, hreflang head, 모바일 토글(7케이스). 기존 read/flow는 무수정 통과(bare goto는 `setLocale` 쿠키로 서버 리다이렉트→콘텐츠 동일·스크린샷 baseline 유지, URL 단언은 `**`-glob·비앵커 정규식이라 `/ko`에 그대로 매칭). `tests/helpers/locale.ts`만 `/ko`·`/en` 재부착으로 수정. `$locale` route에 `notFoundComponent` 추가(로케일 하위 미존재 경로의 404).
- 완료: **about · community · research · admissions · reservations(정적) · 10-10-project · admin · internal · search/404 전체** · **people/academics 읽기 전체**(+주요 flow)
- **테스트 컨벤션 리팩토링 완료**(2026-06-14): 라우트별 `smoke.spec.ts`+`visual.spec.ts`를 **`read.spec.ts` 하나로 통합**(콘텐츠 계약 assert + `toHaveScreenshot`). Playwright 프로젝트는 `read`(데스크톱)·`read-mobile`(390px)·`flow`(데스크톱, deps=[read,read-mobile]). 모바일 baseline(`*-read-mobile-linux.png`) 생성, 검색 빈/결과 read 추가, 이중언어 flow에 en round-trip(`/en` 상세/목록 노출 확인) 추가. 데스크톱 baseline은 스냅샷 디렉터리만 `read.spec.ts-snapshots`로 이동해 재사용. (이후 baseline은 핀된 Linux 컨테이너 단일 세트 `*-linux.png`로 전환 — CLAUDE.md §3 "비주얼 baseline은 Linux 단일" 참고.)
- **백엔드 #399로 업그레이드 완료**(image-modal/FTS/교수en 수정 반영). 향후 origin/main 갱신 시 JAR 재빌드 필요.
- **전 라우트 커버리지 달성**(읽기 전 라우트 + 편집 가능 라우트 flow). 남은 건 선택적 심화(추가 조합/엣지)뿐.
- 참고(시드 인프라): 게시물 표시 날짜가 createdAt이면 normalize-dates.sh에 테이블 추가, payload 날짜면 불필요. 태그 있으면 enrollTag 재시드. PUT 업서트 싱글톤은 `postMultipart(...,'PUT')`. 다국어 엔티티 ko/en POST는 `{ko,en}` 구조(단 professor는 en 이름 버그).
- 도메인 순서: about(나머지) → community → people → research(나머지) → academics → admissions → reservations → 10-10-project → main/misc → admin/internal

### 시드 원칙 (중요)
- **API 우선**: 생성 가능한 엔티티는 `tests/setup/seed/<domain>.ts`에서 `postMultipart`로 시드.
- **SQL은 예외적으로만**: API 생성 경로가 **없는** content 싱글톤(about overview/greetings/history/contact 등 — PUT만 있고 POST 없음, 빈 DB면 500)은 `tests/setup/seed-content.sh`가 SQL로 직접 시드. utf8mb4 필수. 텍스트는 `seed/about.ts`의 상수와 일치시킬 것.

## 도메인별 체크리스트

read는 ko 기준(데스크톱+모바일). flow는 staff 편집/추가/삭제가 있는 라우트만(en 입력은 flow에서 round-trip 검증).

### main / misc
| 라우트 | read | flow | 비고 |
|---|---|---|---|
| `/` (메인) | ✅ | — | NewsSection(isSlide 새소식)/ImportantSection(isImportant 공지)/NoticeSection. 슬라이드 1개라 carousel pageCnt=1→정지(결정론). NewsCard는 created_at 노출→normalize-dates에 news 추가. isSlide/isImportant는 목록 아이콘 없어 community 비주얼 무영향 |
| `/search` | ✅ | — | 렌더 + 짧은키워드 안내 + **키워드 결과(시드 공지 노출)**. 백엔드 FTS #398 적용 후 동작 |
| `/404` (catch-all `*`) | ✅ | — | 정적 |

### about
| 라우트 | read | flow | 비고 |
|---|---|---|---|
| `/about` | ✅ | — | 정적 CategoryPage 인덱스(데이터 없음) |
| `/about/overview` | ✅ | ✅ | 편집-only. content 싱글톤(SQL 시드) |
| `/about/greetings` | ✅ | ✅ | 편집-only(공통 $type/edit, 토스트 없음) |
| `/about/history` | ✅ | ✅ | 편집-only |
| `/about/future-careers` | ✅ | ✅ | 편집 3종(description 싱글톤 PUT / stat POST·PUT / companies 인라인 POST·PUT·DELETE) 각각 flow. description은 SQL 시드, stat/company는 JSON API(postJson) |
| `/about/student-clubs` | ✅ | ✅ | 인라인 SelectionList CRUD. 삭제 확인 라벨 '삭제'(deleteItem 인자) |
| `/about/facilities` | ✅ | ✅ | 행(article) 스코프 CRUD. 삭제 confirm '삭제' |
| `/about/contact` | ✅ | ✅ | 편집-only |
| `/about/directions` | ✅ | ✅ | :id 편집-only(생성/삭제 API 없음). SQL 시드(행마다 name). SelectionList 기본 선택=koName 오름차순 첫 항목. visual은 #map 마스킹 |

### community
| 라우트 | read | flow | 비고 |
|---|---|---|---|
| `/community` | ✅ | — | 정적 CategoryPage 인덱스 |
| `/community/notice` (+`/:id`) | ✅ | ✅ | 목록/상세/작성→편집→삭제 + **게시 설정**: 비공개(비-staff에게 숨김), 목록 상단 고정(상단 부상), 중요+메인용 제목(titleForMain으로 메인 노출). 상세 삭제 토스트='게시글을 삭제했습니다.' |
| `/community/news` (+`/:id`) | ✅ | ✅ | 목록/상세/CRUD + 게시 설정(비공개=목록에서 숨김). isSlide는 admin flow + 메인에서 검증. **news 목록 loader는 쿠키 미전달**(notice와 비일관)이라 비공개 글이 staff에게도 목록에 안 보임 |
| `/community/seminar` (+`/:id`) | ✅ | ✅ | 목록/상세/작성→편집→삭제. 태그 없음. 작성 성공 시 목록 복귀(상세 아님). 표시 날짜=payload startDate(고정). SeminarDto는 description/introduction/name/affiliation/location non-null → 시드·flow 모두 채움 |
| `/community/faculty-recruitment` | ✅ | ✅ | `/v2/recruit` PUT 업서트 싱글톤(API 시드). 편집-only. 편집 폼은 title 미프리필(빈칸 시작) |

### people
| 라우트 | read | flow | 비고 |
|---|---|---|---|
| `/people` | ✅ | — | 정적 CategoryPage 인덱스 |
| `/people/faculty` (+`/:id`) | ✅ | ✅ | 목록/상세 read(ko/en 정상). flow=추가(필수=이름·직함만, status 기본 ACTIVE)→편집→삭제(편집 폼 Form.Action). 삭제 토스트='교수진을 삭제했습니다.' |
| `/people/emeritus-faculty` (+`/:id`) | ✅ | ✅ | professor INACTIVE. flow=FacultyEditor(?status=INACTIVE) 추가→emeritus 상세→편집→삭제. 토스트='역대 교수진을 ...' |
| `/people/staff` (+`/:id`) | ✅ | ✅ | flow=추가(ko/en, tasks는 Form.TextList: _new 입력+'추가')→편집→삭제. 편집 폼엔 task별 삭제+Form.Action 삭제 공존 → .last() |

### research
| 라우트 | read | flow | 비고 |
|---|---|---|---|
| `/research` | ✅ | — | 정적 CategoryPage 인덱스 |
| `/research/groups` | ✅ | ✅ | 인덱스 인라인 상세(SelectionList). `/api/v2/research` type=groups. seed/research.ts(시스템). 선택 id=그룹명 |
| `/research/centers` | ✅ | ✅ | 인덱스 인라인 상세. type=centers + websiteURL. seed/research.ts(인공지능 연구센터). 선택 id=숫자 |
| `/research/labs` (+`/:id`) | ✅ | ✅ | **reference 구현** |
| `/research/top-conference-list` | ✅ | — | 읽기 전용(편집 UI 없음). conference_page 싱글톤은 SQL로 빈 행(seed-content.sh) → 시더가 PATCH로 conference 추가(author=staff). modifiedAt은 normalize-dates.sh로 고정. 페이지가 language 무시(ko/en 동일) |

### admissions (동적 `:mainType/:postType`)
| 라우트 | read | flow | 비고 |
|---|---|---|---|
| `/admissions` | ✅ | — | 정적 CategoryPage 인덱스 |
| `/admissions/:mainType/:postType` | ✅ | ✅ | 7개 조합 전부 콘텐츠 싱글톤(SQL 시드, ko/en). **name 컬럼 non-null 필수(NULL이면 500)**. smoke 7조합, visual 2(기본+extraBottom), flow 1(학부 정시 편집) |

### academics
| 라우트 | read | flow | 비고 |
|---|---|---|---|
| `/academics` | ✅ | — | 정적 CategoryPage 인덱스 |
| `/academics/undergraduate/curriculum` | ✅ | ✅ | 연도 타임라인. API 시드. flow=연도 2099 추가→편집(연도 disabled)→삭제. OrderByYearDesc라 추가 직후 선택 |
| `/academics/undergraduate/general-studies-requirements` | ✅ | ✅ | 연도 타임라인. flow=curriculum과 동일 패턴 |
| `/academics/undergraduate/degree-requirements` | ✅ | ✅ | 콘텐츠 싱글톤(SQL 시드, 학부 전용). 편집 토스트='학부 졸업규정을 수정했습니다.' |
| `/academics/:studentType/courses` | ✅ | ✅ | flow=staff CRUD: '새 교과목' 모달 추가→목록(행 버튼)→상세 모달 편집('확인')→삭제('삭제'). code=PK(고유값). 학점/학년/구분 드롭다운 기본값. en round-trip(/en 목록). 설명=Form.TextArea(fillTextArea) |
| `/academics/:studentType/guide` | ✅ | ✅ | 콘텐츠 싱글톤(SQL 시드, undergraduate+graduate). language 미전달→en도 ko 본문. 편집 토스트='수정에 성공했습니다.' |
| `/academics/:studentType/course-changes` | ✅ | ✅ | 연도 타임라인(학부). flow=동일 패턴. 단 추가 토스트만 '저장에 성공했습니다.' |
| `/academics/:studentType/scholarship` (+`/:id`) | ✅ | ✅ | 페이지 description=SQL 싱글톤, 장학금 목록=API(`POST .../scholarship`, {koName,koDescription,enName,enDescription}). 목록 ko 이름, 상세 다국어. 편집→상세 복귀. 삭제 토스트='장학금을 삭제했습니다.' |

### reservations
| 라우트 | read | flow | 비고 |
|---|---|---|---|
| `/reservations` | ✅ | — | 정적 CategoryPage 인덱스 |
| `/reservations/introduction` | ✅ | — | 정적(하드코딩 HTML, SelectionList 3개). 시드 불필요 |
| `/reservations/privacy-policy` | ✅ | — | 정적(하드코딩 HTML). 시드 불필요 |
| `/reservations/:roomType/:roomName` | ✅ | ✅ | 세미나실(301-417, roomId1). read=`?selectedDate=2024-03-15`로 주 고정 + **staff-only 방(302-208) 비로그인 fallback("관리자만 열람 가능합니다") 렌더**. flow=staff '예약하기' 모달→종료시간 마지막 옵션→필수항목+동의→제출(예약 날짜 읽어 그 주로 이동해 검증). **room은 SQL 시드(roomNameToId 1~16)**. [[project_reservation_system]] |

### 10-10-project
| 라우트 | read | flow | 비고 |
|---|---|---|---|
| `/10-10-project` | ✅ | — | 정적 CategoryPage 인덱스 |
| `/10-10-project/proposal` | ✅ | — | 정적(buildHtmlContent, 시드 불필요) |
| `/10-10-project/manager` | ✅ | — | 정적 |
| `/10-10-project/participants` | ✅ | — | 정적 |

### admin / internal
| 라우트 | read | flow | 비고 |
|---|---|---|---|
| `/admin` | — | ✅ | staff. **3종 관리 종단 검증**: 슬라이드(표시 새소식→목록→해제) / 중요안내(표시 공지→목록→해제) / 이미지팝업(등록→수정→삭제, 백엔드 #396). 체크박스는 appearance-none이라 label 클릭 |
| `/.internal` (+`/edit`) | ✅ | ✅ | PUT 업서트 싱글톤(API 시드). 비로컬라이즈 `_route`(ko만). 편집 성공 토스트 없음(네비게이션으로 확인) |

## 시드 모듈 현황 (`tests/setup/seed/`)
- ✅ `research.ts` — group/professor/lab
- ✅ `about.ts` — clubs/facilities/future-careers(stat·company). content 싱글톤은 `seed-content.sh`(SQL)
- ✅ `client.ts` — `postMultipart`(multipart) + `postJson`(application/json, 평문 응답도 허용)
- ✅ `community.ts` — notice/news/seminar(+enrollTag 재시드) + recruit(PUT 업서트)
- ✅ `people.ts` — emeritus(professor INACTIVE) + staff. faculty(ACTIVE)는 research.ts가 시드
- ✅ `academics.ts` — 콘텐츠 싱글톤 상수(SQL) + scholarship/year타임라인/courses API 시더(seedAcademics)
- ✅ `admissions.ts` — 7개 조합 콘텐츠 싱글톤 기대값 상수(SQL 시드, seeder 없음)
- ⬜ `reservations.ts` 등 도메인 추가 시 생성 후 `index.ts`에 등록

## 어드민 기능 테스트 현황 (단순 본문 외)
**✅ 커버됨:**
- 콘텐츠 CRUD(편집 가능 전 라우트), 게시 설정(공지: 비공개=비-staff 숨김 / 목록 상단 고정=상단 부상 /
  중요+메인용 제목 titleForMain=메인 노출), isSlide(news)·isImportant(notice)는 admin flow가 생성·관리로 검증
- **목록 편집모드 일괄 관리**(notice): 일괄 삭제, 일괄 고정 해제
- **첨부파일 업로드**(notice, Form.File→상세 Attachments), **태그 선택**(notice→상세 Tag)
- **대표 이미지 업로드**(news, Form.Image→목록 카드 img)
- **/admin 관리**: 슬라이드/중요안내 일괄 해제, 이미지 팝업 등록/수정/삭제(이미지·외부링크·**표시 종료일 displayUntil round-trip**)
- **교과목(courses) CRUD**: 추가/편집/삭제(모달) + en round-trip
- **예약**: 생성 + 취소('해당 예약만 삭제') + **반복 예약(2회) 생성→'반복 예약 전체 삭제'(1·2주차 모두 사라짐 검증)** + staff-only 방 fallback 렌더(read)
- **역할 게이팅(프론트 렌더)**: LoginVisible staff 노출=전 flow가 편집 UI 클릭으로 암묵 검증, 숨김=read 스크린샷, staff-only 방 fallback=read 전용 테스트

**🔵 백엔드 소유 → E2E 대상 아님(범위 기준 적용):**
- 역할 **인가 강제**(RESERVATION/LABMASTER/COUNCIL이 엔드포인트 호출 가능/거부), **정기예약 기간 LABMASTER-only**(프론트에 term 생성 API 없음 = GET만), 409 충돌/서버 검증, 목록 **정렬·필터**(고정 상단부상/비공개 숨김의 *정렬·필터 자체*). → 백엔드 테스트 몫. (CLAUDE.md "E2E 범위 기준" 참고)

**⬜ 미커버(프론트 소유지만 저우선/난이도↑):**
- 만료일 pinnedUntil/importantUntil **날짜피커 입력 와이어링**(만료 동작 자체는 백엔드).
- **본문 이미지 삽입**(suneditor→`/v1/file/upload`): 모든 HTML 에디터의 staff 기능이나 에디터 구동 비용 큼 → 대표 1개 보류.
- news/seminar 비공개·중요는 notice와 동일 메커니즘이라 대표 검증으로 갈음.
- **news 목록 loader 쿠키 미전달(프론트 비일관)**: notice 목록 loader는 쿠키를 전달해 staff가 비공개 글을
  보지만, news 목록 loader는 쿠키 미전달 → 비공개 새소식이 staff에게도 목록에 안 보임. 마이그레이션 안전망
  관점에서 현재 동작(목록에서 숨김)만 검증. 프론트 정합성 개선 여지(별도 이슈).
- **/v2/admin/slide 미인증 302**: 비로그인 admin slide 요청이 302(OAuth)로 → preview-server SSR이 비-JSON
  파싱 실패로 로그에 'WebServer 500' 노이즈. admin loader가 `if(!cookie) return`으로 가드해 실제 테스트엔 무영향.
- DELETE 빈 200 본문 → `fetchJson` 버그(수정 완료, 미커밋). 22개 DELETE 사이트 영향.
- 비주얼 baseline은 **Linux 단일**(`*-linux.png`, 데스크톱 `-read-` / 모바일 `-read-mobile-`). 핀된 컨테이너가 정본 렌더 환경이라 머신 무관하게 픽셀 동일(CLAUDE.md §3 "비주얼 baseline은 Linux 단일" 참고).
- **모바일 read 주의(`hidden sm:*`)**: 데스크톱에만 보이는 요소를 콘텐츠 계약으로 쓰면 모바일(390px)에서 깨진다.
  예: 10-10-project 하위 페이지는 'Project'가 SubNavbar(`hidden sm:block`)에만 있어, 모바일에도 보이는
  각 페이지 PageTitle(`Proposal`/`Manager`/`Participants(Professors)`)을 heading으로 assert. 새 read 작성 시
  모바일에서도 보이는 요소를 고를 것.
- **en round-trip 선택 항목 주의**: SelectionList 인덱스 인라인(research/groups)에서 새 항목이 en 정렬상 첫
  항목이면 자동 선택되어 목록 link가 아닌 제목으로 렌더된다 → en round-trip은 link 역할 대신 `getByText`로 검증.
  centers는 선택 id가 숫자(id 오름차순 baseline이 항상 선택)라 무관. en round-trip 대상: faculty/emeritus/staff/
  labs/scholarship(상세 heading) · centers/groups(목록·제목) · admissions/greetings(싱글톤 본문, 동일 $type/edit
  형제는 greetings로 대표).
- **게시물 날짜 비결정성**: notice/news/seminar의 created_at은 서버가 박아 매 런 달라짐 →
  `tests/setup/normalize-dates.sh`가 globalSetup에서 고정값('2024-03-15 09:00:00')으로 정규화.
  새 게시물 도메인(news/seminar) 추가 시 이 스크립트의 UPDATE에 테이블 한 줄 추가할 것. 마스킹 불필요.
- **태그 참조 테이블**: notice/news 태그(tag_in_notice 등)는 Flyway가 아니라 enrollTag API로 채워지는데
  reset-db가 truncate함. baseline 시더가 매 런 enrollTag로 재등록(없으면 태그 단 글 생성이 500).
- **reservations/room flow 벽시계 의존(일요일 밤 등 주 경계) — 해결됨**: 예약 모달이 "오늘 가장 이른 가용
  슬롯"을 기본값으로 잡는데 늦은 시각이면 다음날(=다음 주)로 롤오버되고, 캘린더는 selectedDate의 주만 보여줘
  생성된 예약이 표시 주를 벗어나 `getByText(title)`가 안 보여 실패했었다(생성 토스트는 성공). 실서버라
  `page.clock`으론 못 고침(앱 시각만 고정되면 백엔드 시각과 어긋나 거부). **픽스: 모달이 잡은 기본 예약 날짜를
  읽어(`예약 날짜` 버튼의 `YYYY.MM.DD.`) 제출 후 `?selectedDate=`로 그 날짜의 주로 캘린더를 이동해 검증** →
  시각/요일과 무관하게 노출. (늦은 일요일 밤 조건에서 통과 확인.)
- **풀 병렬 실행 간헐 플레이키 — 원인 규명 + 하드닝 완료**: 원인은 **로컬 워커 동시성 vs 단일 docker 백엔드 경합**.
  기본 워커수(코어 수)로 동시 mutation이 실서버를 과부하 → ephemeral 신호(성공 토스트)가 5초 안에 못 떠 간헐 실패.
  격리/저워커 실행에선 항상 통과(컨테이너 런은 `CI=1`→`workers:1`). **조치 3종**: (1) `playwright.config` 로컬 워커 수 캡(검증:
  4워커 flow 4/4 그린, 풀런 3/3 그린 — 기본값은 ~1/5 flaky), (2) 생성 성공 단언을 ephemeral 토스트 → **영속 신호**로
  교체(labs/news=waitForURL, 예약=모달 닫힘 대기), (3) news 대표 이미지 `<img>` 타임아웃 15s.
  - **잔여(저빈도, infra 의존)**: `community/news` 대표 이미지 카드 `<img>` — `ui/Image`가 src **로드 성공 시에만**
    `<img>`, 실패 시 폴백 `<div>`(SnuLogo)로 **영구** 전환(재시도 안 함). 즉 업로드 이미지의 **서빙·로드**(백엔드/infra)
    에 의존 → 기준상 백엔드 영역. 워커 캡으로 거의 안정, 드물게 미스 시 컨테이너 런 `retries=2`가 흡수.
- **그룹 연구실 목록 비정렬**: research/groups 상세의 `item.labs`는 백엔드가 비정렬 컬렉션(Set)으로
  반환 → 런마다 순서가 바뀜. 풀 병렬 실행에서 groups 비주얼이 플레이키 → 해당 ul을 마스킹으로 해결.
  (스모크가 연구실 존재는 검증). 비슷하게 순서 보장 없는 목록 비주얼은 마스킹 고려.
- **백엔드 버전 동기화 필수**: 로컬 `../csereal-server`는 `develop` 브랜치로, 한동안 #395에 머물러
  있었다(docker는 소스에서 **prebuilt JAR**를 COPY하므로 소스가 낡으면 docker도 낡음). origin/main(#399)으로
  ff-merge + JAR 재빌드(호스트 JDK는 11이라 Java21 컨테이너에서 `./gradlew bootJar -x test`) + `up -d --build`
  해야 최신. 이걸로 다음 두 가지가 한 번에 해결됐다(예전 #395 기준 메모는 폐기):
  - (구) 교수 en 이름=ko 버그 → #399에서 **수정됨**(en 정상). faculty/emeritus en 스펙은 `.en` 기대값으로 복구.
  - (구) /v2/image-modal 404 → #396 **추가됨**. admin 이미지 팝업 종단 검증 가능.
  - (구) 검색 한글 FTS 미동작 → #398 **수정됨**. /search 키워드 결과 검증 가능.
