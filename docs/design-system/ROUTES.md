# 화면 라우트 목록

[조사 요약과 대표 화면](INVENTORY.md) · [진행 현황](PLAN.md)

## 집계 기준

조사 기준은 `d1baf83c`의 앱 소스다. `createFileRoute` 선언 99개를 수집하고 화면 컴포넌트가 있는
94개를 분류했다. `Outlet` 전용 2개와 서버 응답 3개는 화면에서 제외한다. `__root.tsx`와 오류·빈 상태는
화면에 공통으로 나타나는 별도 조사 대상이다. `$locale`, `$studentType`, `$id` 등은 펼치지 않은 라우트 템플릿이다.
따라서 아래 숫자는 운영 URL 개수나 시각적 변형의 개수가 아니다. 끝의 `/`는 소스의 라우트 선언을 유지했다.

분류는 조사 범위를 묶기 위한 것이다. 같은 유형에 속한다고 같은 컴포넌트로 통합하기로 결정한 것은 아니다.

## 유형별 합계

| 유형 | 템플릿 수 |
| --- | ---: |
| M · 메인 | 1 |
| C · 카테고리 | 8 |
| R · 안내 본문 | 13 |
| S · 선택형 상세 | 5 |
| L · 목록·검색·표 | 6 |
| D · 대상 상세 | 8 |
| G · 인물 목록·복합 소개 | 5 |
| A · 학사 도구·연도별 콘텐츠 | 5 |
| B · 예약 달력 | 1 |
| E · 생성·편집 | 41 |
| O · 관리 | 1 |
| **합계** | **94** |

## 전체 화면

각 화면은 한 행에 한 번만 기록했다. 링크는 해당 라우트의 구현이다.

### M · 메인 (1)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/$locale/` | `MainPage` | [$locale/index.tsx](../../apps/web/src/routes/$locale/index.tsx) |

### C · 카테고리 (8)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/$locale/10-10-project/` | `TenTenProjectPage` | [$locale/10-10-project/index.tsx](../../apps/web/src/routes/$locale/10-10-project/index.tsx) |
| `/$locale/about/` | `AboutPage` | [$locale/about/index.tsx](../../apps/web/src/routes/$locale/about/index.tsx) |
| `/$locale/academics/` | `AcademicsPage` | [$locale/academics/index.tsx](../../apps/web/src/routes/$locale/academics/index.tsx) |
| `/$locale/admissions/` | `AdmissionsPage` | [$locale/admissions/index.tsx](../../apps/web/src/routes/$locale/admissions/index.tsx) |
| `/$locale/community/` | `CommunityPage` | [$locale/community/index.tsx](../../apps/web/src/routes/$locale/community/index.tsx) |
| `/$locale/people/` | `PeoplePage` | [$locale/people/index.tsx](../../apps/web/src/routes/$locale/people/index.tsx) |
| `/$locale/research/` | `ResearchPage` | [$locale/research/index.tsx](../../apps/web/src/routes/$locale/research/index.tsx) |
| `/$locale/reservations/` | `ReservationsPage` | [$locale/reservations/index.tsx](../../apps/web/src/routes/$locale/reservations/index.tsx) |

### R · 안내 본문 (13)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/$locale/10-10-project/manager` | `TenTenManagerPage` | [$locale/10-10-project/manager.tsx](../../apps/web/src/routes/$locale/10-10-project/manager.tsx) |
| `/$locale/10-10-project/participants` | `TenTenParticipantsPage` | [$locale/10-10-project/participants.tsx](../../apps/web/src/routes/$locale/10-10-project/participants.tsx) |
| `/$locale/10-10-project/proposal` | `TenTenProposalPage` | [$locale/10-10-project/proposal.tsx](../../apps/web/src/routes/$locale/10-10-project/proposal.tsx) |
| `/$locale/about/contact` | `ContactPage` | [$locale/about/contact.tsx](../../apps/web/src/routes/$locale/about/contact.tsx) |
| `/$locale/about/greetings` | `GreetingsPage` | [$locale/about/greetings.tsx](../../apps/web/src/routes/$locale/about/greetings.tsx) |
| `/$locale/about/history` | `HistoryPage` | [$locale/about/history.tsx](../../apps/web/src/routes/$locale/about/history.tsx) |
| `/$locale/about/overview/` | `Overview` | [$locale/about/overview/index.tsx](../../apps/web/src/routes/$locale/about/overview/index.tsx) |
| `/$locale/academics/$studentType/guide/` | `GuidePage` | [$locale/academics/$studentType/guide/index.tsx](../../apps/web/src/routes/$locale/academics/$studentType/guide/index.tsx) |
| `/$locale/academics/undergraduate/degree-requirements/` | `DegreeRequirementsPage` | [$locale/academics/undergraduate/degree-requirements/index.tsx](../../apps/web/src/routes/$locale/academics/undergraduate/degree-requirements/index.tsx) |
| `/$locale/admissions/$mainType/$postType/` | `AdmissionsPage` | [$locale/admissions/$mainType/$postType/index.tsx](../../apps/web/src/routes/$locale/admissions/$mainType/$postType/index.tsx) |
| `/$locale/community/faculty-recruitment/` | `FacultyRecruitmentPage` | [$locale/community/faculty-recruitment/index.tsx](../../apps/web/src/routes/$locale/community/faculty-recruitment/index.tsx) |
| `/$locale/reservations/privacy-policy` | `ReservationPrivacyPolicyPage` | [$locale/reservations/privacy-policy.tsx](../../apps/web/src/routes/$locale/reservations/privacy-policy.tsx) |
| `/.internal/` | `InternalPage` | [[.]internal/index.tsx](../../apps/web/src/routes/[.]internal/index.tsx) |

### S · 선택형 상세 (5)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/$locale/about/directions/` | `DirectionsPage` | [$locale/about/directions/index.tsx](../../apps/web/src/routes/$locale/about/directions/index.tsx) |
| `/$locale/about/student-clubs/` | `StudentClubsPage` | [$locale/about/student-clubs/index.tsx](../../apps/web/src/routes/$locale/about/student-clubs/index.tsx) |
| `/$locale/research/centers/` | `ResearchCentersPage` | [$locale/research/centers/index.tsx](../../apps/web/src/routes/$locale/research/centers/index.tsx) |
| `/$locale/research/groups/` | `ResearchGroupsPage` | [$locale/research/groups/index.tsx](../../apps/web/src/routes/$locale/research/groups/index.tsx) |
| `/$locale/reservations/introduction` | `ReservationsIntroductionPage` | [$locale/reservations/introduction.tsx](../../apps/web/src/routes/$locale/reservations/introduction.tsx) |

### L · 목록·검색·표 (6)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/$locale/community/news/` | `NewsPage` | [$locale/community/news/index.tsx](../../apps/web/src/routes/$locale/community/news/index.tsx) |
| `/$locale/community/notice/` | `NoticePage` | [$locale/community/notice/index.tsx](../../apps/web/src/routes/$locale/community/notice/index.tsx) |
| `/$locale/community/seminar/` | `SeminarPage` | [$locale/community/seminar/index.tsx](../../apps/web/src/routes/$locale/community/seminar/index.tsx) |
| `/$locale/research/labs/` | `ResearchLabsPage` | [$locale/research/labs/index.tsx](../../apps/web/src/routes/$locale/research/labs/index.tsx) |
| `/$locale/research/top-conference-list/` | `TopConferenceListPage` | [$locale/research/top-conference-list/index.tsx](../../apps/web/src/routes/$locale/research/top-conference-list/index.tsx) |
| `/$locale/search/` | `SearchPage` | [$locale/search/index.tsx](../../apps/web/src/routes/$locale/search/index.tsx) |

### D · 대상 상세 (8)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/$locale/academics/$studentType/scholarship/$id/` | `ScholarshipDetailPage` | [$locale/academics/$studentType/scholarship/$id/index.tsx](../../apps/web/src/routes/$locale/academics/$studentType/scholarship/$id/index.tsx) |
| `/$locale/community/news/$id` | `NewsDetailPage` | [$locale/community/news/$id.tsx](../../apps/web/src/routes/$locale/community/news/$id.tsx) |
| `/$locale/community/notice/$id` | `NoticeDetailPage` | [$locale/community/notice/$id.tsx](../../apps/web/src/routes/$locale/community/notice/$id.tsx) |
| `/$locale/community/seminar/$id` | `SeminarDetailPage` | [$locale/community/seminar/$id.tsx](../../apps/web/src/routes/$locale/community/seminar/$id.tsx) |
| `/$locale/people/emeritus-faculty/$id/` | `EmeritusFacultyDetailPage` | [$locale/people/emeritus-faculty/$id/index.tsx](../../apps/web/src/routes/$locale/people/emeritus-faculty/$id/index.tsx) |
| `/$locale/people/faculty/$id/` | `FacultyDetailPage` | [$locale/people/faculty/$id/index.tsx](../../apps/web/src/routes/$locale/people/faculty/$id/index.tsx) |
| `/$locale/people/staff/$id/` | `StaffDetailPage` | [$locale/people/staff/$id/index.tsx](../../apps/web/src/routes/$locale/people/staff/$id/index.tsx) |
| `/$locale/research/labs/$id/` | `ResearchLabDetailPage` | [$locale/research/labs/$id/index.tsx](../../apps/web/src/routes/$locale/research/labs/$id/index.tsx) |

### G · 인물 목록·복합 소개 (5)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/$locale/about/facilities/` | `FacilitiesPage` | [$locale/about/facilities/index.tsx](../../apps/web/src/routes/$locale/about/facilities/index.tsx) |
| `/$locale/about/future-careers/` | `FutureCareersPage` | [$locale/about/future-careers/index.tsx](../../apps/web/src/routes/$locale/about/future-careers/index.tsx) |
| `/$locale/people/emeritus-faculty/` | `EmeritusFacultyPage` | [$locale/people/emeritus-faculty/index.tsx](../../apps/web/src/routes/$locale/people/emeritus-faculty/index.tsx) |
| `/$locale/people/faculty/` | `FacultyPage` | [$locale/people/faculty/index.tsx](../../apps/web/src/routes/$locale/people/faculty/index.tsx) |
| `/$locale/people/staff/` | `StaffPage` | [$locale/people/staff/index.tsx](../../apps/web/src/routes/$locale/people/staff/index.tsx) |

### A · 학사 도구·연도별 콘텐츠 (5)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/$locale/academics/$studentType/course-changes/` | `CourseChangesPage` | [$locale/academics/$studentType/course-changes/index.tsx](../../apps/web/src/routes/$locale/academics/$studentType/course-changes/index.tsx) |
| `/$locale/academics/$studentType/courses` | `CoursesRoute` | [$locale/academics/$studentType/courses.tsx](../../apps/web/src/routes/$locale/academics/$studentType/courses.tsx) |
| `/$locale/academics/$studentType/scholarship/` | `ScholarshipPage` | [$locale/academics/$studentType/scholarship/index.tsx](../../apps/web/src/routes/$locale/academics/$studentType/scholarship/index.tsx) |
| `/$locale/academics/undergraduate/curriculum/` | `UndergraduateCurriculumPage` | [$locale/academics/undergraduate/curriculum/index.tsx](../../apps/web/src/routes/$locale/academics/undergraduate/curriculum/index.tsx) |
| `/$locale/academics/undergraduate/general-studies-requirements/` | `GeneralStudiesRequirementsPage` | [$locale/academics/undergraduate/general-studies-requirements/index.tsx](../../apps/web/src/routes/$locale/academics/undergraduate/general-studies-requirements/index.tsx) |

### B · 예약 달력 (1)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/$locale/reservations/$roomType/$roomName` | `RoomReservationPage` | [$locale/reservations/$roomType/$roomName.tsx](../../apps/web/src/routes/$locale/reservations/$roomType/$roomName.tsx) |

### E · 생성·편집 (41)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/$locale/about/$type/edit` | `AboutEdit` | [$locale/about/$type/edit.tsx](../../apps/web/src/routes/$locale/about/$type/edit.tsx) |
| `/$locale/about/directions/$id/edit` | `DirectionsEdit` | [$locale/about/directions/$id/edit.tsx](../../apps/web/src/routes/$locale/about/directions/$id/edit.tsx) |
| `/$locale/about/facilities/create` | `FacilitiesCreate` | [$locale/about/facilities/create.tsx](../../apps/web/src/routes/$locale/about/facilities/create.tsx) |
| `/$locale/about/facilities/edit` | `FacilitiesEdit` | [$locale/about/facilities/edit.tsx](../../apps/web/src/routes/$locale/about/facilities/edit.tsx) |
| `/$locale/about/future-careers/description/edit` | `CareerDescriptionEdit` | [$locale/about/future-careers/description/edit.tsx](../../apps/web/src/routes/$locale/about/future-careers/description/edit.tsx) |
| `/$locale/about/future-careers/stat/create` | `CareerStatCreatePage` | [$locale/about/future-careers/stat/create.tsx](../../apps/web/src/routes/$locale/about/future-careers/stat/create.tsx) |
| `/$locale/about/future-careers/stat/edit` | `CareerStatEditPage` | [$locale/about/future-careers/stat/edit.tsx](../../apps/web/src/routes/$locale/about/future-careers/stat/edit.tsx) |
| `/$locale/about/overview/edit` | `OverviewEdit` | [$locale/about/overview/edit.tsx](../../apps/web/src/routes/$locale/about/overview/edit.tsx) |
| `/$locale/about/student-clubs/create` | `StudentClubsCreate` | [$locale/about/student-clubs/create.tsx](../../apps/web/src/routes/$locale/about/student-clubs/create.tsx) |
| `/$locale/about/student-clubs/edit` | `StudentClubsEdit` | [$locale/about/student-clubs/edit.tsx](../../apps/web/src/routes/$locale/about/student-clubs/edit.tsx) |
| `/$locale/academics/$studentType/course-changes/create` | `CourseChangesCreatePage` | [$locale/academics/$studentType/course-changes/create.tsx](../../apps/web/src/routes/$locale/academics/$studentType/course-changes/create.tsx) |
| `/$locale/academics/$studentType/course-changes/edit/$year` | `CourseChangesEditPage` | [$locale/academics/$studentType/course-changes/edit/$year.tsx](../../apps/web/src/routes/$locale/academics/$studentType/course-changes/edit/$year.tsx) |
| `/$locale/academics/$studentType/guide/edit` | `GuideEditPage` | [$locale/academics/$studentType/guide/edit.tsx](../../apps/web/src/routes/$locale/academics/$studentType/guide/edit.tsx) |
| `/$locale/academics/$studentType/scholarship/$id/edit` | `ScholarshipEditPage` | [$locale/academics/$studentType/scholarship/$id/edit.tsx](../../apps/web/src/routes/$locale/academics/$studentType/scholarship/$id/edit.tsx) |
| `/$locale/academics/$studentType/scholarship/create` | `ScholarshipCreatePage` | [$locale/academics/$studentType/scholarship/create.tsx](../../apps/web/src/routes/$locale/academics/$studentType/scholarship/create.tsx) |
| `/$locale/academics/$studentType/scholarship/edit` | `ScholarshipEditPage` | [$locale/academics/$studentType/scholarship/edit.tsx](../../apps/web/src/routes/$locale/academics/$studentType/scholarship/edit.tsx) |
| `/$locale/academics/undergraduate/curriculum/create` | `CurriculumCreatePage` | [$locale/academics/undergraduate/curriculum/create.tsx](../../apps/web/src/routes/$locale/academics/undergraduate/curriculum/create.tsx) |
| `/$locale/academics/undergraduate/curriculum/edit/$year` | `CurriculumEditPage` | [$locale/academics/undergraduate/curriculum/edit.$year.tsx](../../apps/web/src/routes/$locale/academics/undergraduate/curriculum/edit.$year.tsx) |
| `/$locale/academics/undergraduate/degree-requirements/edit` | `DegreeRequirementsEditPage` | [$locale/academics/undergraduate/degree-requirements/edit.tsx](../../apps/web/src/routes/$locale/academics/undergraduate/degree-requirements/edit.tsx) |
| `/$locale/academics/undergraduate/general-studies-requirements/create` | `GeneralStudiesCreatePage` | [$locale/academics/undergraduate/general-studies-requirements/create.tsx](../../apps/web/src/routes/$locale/academics/undergraduate/general-studies-requirements/create.tsx) |
| `/$locale/academics/undergraduate/general-studies-requirements/edit/$year` | `GeneralStudiesEditPage` | [$locale/academics/undergraduate/general-studies-requirements/edit.$year.tsx](../../apps/web/src/routes/$locale/academics/undergraduate/general-studies-requirements/edit.$year.tsx) |
| `/$locale/admissions/$mainType/$postType/edit` | `AdmissionsEdit` | [$locale/admissions/$mainType/$postType/edit.tsx](../../apps/web/src/routes/$locale/admissions/$mainType/$postType/edit.tsx) |
| `/$locale/community/faculty-recruitment/edit` | `FacultyRecruitmentEditPage` | [$locale/community/faculty-recruitment/edit.tsx](../../apps/web/src/routes/$locale/community/faculty-recruitment/edit.tsx) |
| `/$locale/community/news/create` | `NewsCreatePage` | [$locale/community/news/create.tsx](../../apps/web/src/routes/$locale/community/news/create.tsx) |
| `/$locale/community/news/edit/$id` | `NewsEditPage` | [$locale/community/news/edit.$id.tsx](../../apps/web/src/routes/$locale/community/news/edit.$id.tsx) |
| `/$locale/community/notice/create` | `NoticeCreatePage` | [$locale/community/notice/create.tsx](../../apps/web/src/routes/$locale/community/notice/create.tsx) |
| `/$locale/community/notice/edit/$id` | `NoticeEditPage` | [$locale/community/notice/edit.$id.tsx](../../apps/web/src/routes/$locale/community/notice/edit.$id.tsx) |
| `/$locale/community/seminar/create` | `SeminarCreatePage` | [$locale/community/seminar/create.tsx](../../apps/web/src/routes/$locale/community/seminar/create.tsx) |
| `/$locale/community/seminar/edit/$id` | `SeminarEditPage` | [$locale/community/seminar/edit.$id.tsx](../../apps/web/src/routes/$locale/community/seminar/edit.$id.tsx) |
| `/$locale/people/emeritus-faculty/$id/edit` | `EmeritusFacultyEdit` | [$locale/people/emeritus-faculty/$id/edit.tsx](../../apps/web/src/routes/$locale/people/emeritus-faculty/$id/edit.tsx) |
| `/$locale/people/faculty/$id/edit` | `FacultyEdit` | [$locale/people/faculty/$id/edit.tsx](../../apps/web/src/routes/$locale/people/faculty/$id/edit.tsx) |
| `/$locale/people/faculty/create` | `FacultyCreate` | [$locale/people/faculty/create.tsx](../../apps/web/src/routes/$locale/people/faculty/create.tsx) |
| `/$locale/people/staff/$id/edit` | `StaffEdit` | [$locale/people/staff/$id/edit.tsx](../../apps/web/src/routes/$locale/people/staff/$id/edit.tsx) |
| `/$locale/people/staff/create` | `StaffCreate` | [$locale/people/staff/create.tsx](../../apps/web/src/routes/$locale/people/staff/create.tsx) |
| `/$locale/research/centers/$id/edit` | `ResearchCenterEdit` | [$locale/research/centers/$id/edit.tsx](../../apps/web/src/routes/$locale/research/centers/$id/edit.tsx) |
| `/$locale/research/centers/create` | `ResearchCenterCreate` | [$locale/research/centers/create.tsx](../../apps/web/src/routes/$locale/research/centers/create.tsx) |
| `/$locale/research/groups/$id/edit` | `ResearchGroupEdit` | [$locale/research/groups/$id/edit.tsx](../../apps/web/src/routes/$locale/research/groups/$id/edit.tsx) |
| `/$locale/research/groups/create` | `ResearchGroupCreate` | [$locale/research/groups/create.tsx](../../apps/web/src/routes/$locale/research/groups/create.tsx) |
| `/$locale/research/labs/$id/edit` | `ResearchLabEdit` | [$locale/research/labs/$id/edit.tsx](../../apps/web/src/routes/$locale/research/labs/$id/edit.tsx) |
| `/$locale/research/labs/create` | `ResearchLabCreate` | [$locale/research/labs/create.tsx](../../apps/web/src/routes/$locale/research/labs/create.tsx) |
| `/.internal/edit` | `InternalEdit` | [[.]internal/edit.tsx](../../apps/web/src/routes/[.]internal/edit.tsx) |

### O · 관리 (1)

| 라우트 | 화면 컴포넌트 | 소스 |
| --- | --- | --- |
| `/admin/` | `AdminPage` | [admin/index.tsx](../../apps/web/src/routes/admin/index.tsx) |

## 화면에서 제외한 선언

| 선언 | 구분 | 소스 |
| --- | --- | --- |
| `/$locale` | Outlet 래퍼 | [routes/$locale/route.tsx](../../apps/web/src/routes/$locale/route.tsx) |
| `/$locale/academics/$studentType` | Outlet 래퍼 | [routes/$locale/academics/$studentType.tsx](../../apps/web/src/routes/$locale/academics/$studentType.tsx) |
| `/img` | 서버 응답 | [routes/img.ts](../../apps/web/src/routes/img.ts) |
| `/sitemap.xml` | 서버 응답 | [routes/sitemap[.]xml.ts](../../apps/web/src/routes/sitemap[.]xml.ts) |
| `/sitemap/$file` | 서버 응답 | [routes/sitemap/$file.ts](../../apps/web/src/routes/sitemap/$file.ts) |

## 누락 점검 방법

새 라우트를 추가하거나 조사 기준 커밋을 바꾸면 `src/routes`의 `.ts`·`.tsx`를 TypeScript 구문 트리로 읽어
`createFileRoute`의 문자열 인자와 `component`를 추출해 이 표와 대조한다. 편집·관리 목적은 경로와 구현을
함께 확인한다. 공용 패턴은 로컬 import 관계와 해당 컴포넌트의 실제 마크업을 확인한다.
