import type { components } from './generated';
import type { Param, Res } from './helpers';

// 백엔드 OpenAPI 스펙에서 파생한 응답 타입. 필드를 손으로 적지 않는다 —
// 백엔드가 응답 모양을 바꾸면 `pnpm gen:api` 후 typecheck가 깨진 곳을 짚어준다.

/* ── 공용 ───────────────────────────────────────────────── */

export type Attachment = NonNullable<
  Res<'/api/v2/notice/{noticeId}'>['attachments']
>[number];

/* ── 메인 ───────────────────────────────────────────────── */

export type MainResponse = Res<'/api/v2'>;
export type MainNews = MainResponse['slides'][number];
export type AllMainNotice = MainResponse['notices'];
export type MainImportant = MainResponse['importants'][number];

/* ── 공지 ───────────────────────────────────────────────── */

export type NoticePreviewList = Res<'/api/v2/notice'>;
export type NoticePreview = NoticePreviewList['searchList'][number];
export type Notice = Res<'/api/v2/notice/{noticeId}'>;
export type NoticePostBody = components['schemas']['CreateNoticeReq'];
export type NoticePatchBody = components['schemas']['UpdateNoticeReq'];

/* ── 소식 ───────────────────────────────────────────────── */

export type NewsPreviewList = Res<'/api/v2/news'>;
export type NewsPreview = NewsPreviewList['searchList'][number];
export type News = Res<'/api/v2/news/{newsId}'>;
export type NewsPostBody = components['schemas']['CreateNewsReq'];
export type NewsPatchBody = components['schemas']['UpdateNewsReq'];

/* ── 세미나 ─────────────────────────────────────────────── */

export type SeminarPreviewList = Res<'/api/v2/seminar'>;
export type SeminarPreview = SeminarPreviewList['results'][number];
export type Seminar = Res<'/api/v2/seminar/{seminarId}'>;
export type SeminarPostBody = components['schemas']['CreateSeminarReq'];
export type SeminarPatchBody = components['schemas']['UpdateSeminarReq'];

/* ── 학술행사 ───────────────────────────────────────────── */

export type TopConferenceListResponse = Res<'/api/v2/conference/page'>;

/* ── 교수 초빙 ──────────────────────────────────────────── */

export type FacultyRecruitment = Res<'/api/v2/recruit'>;

/* ── 사용자 ─────────────────────────────────────────────── */

export type MyRole = Res<'/api/v2/user/my-role'>;

/* ── 예약 ───────────────────────────────────────────────── */

export type ReservationPreview = Res<'/api/v2/reservation/week'>[number];
export type Reservation = Res<'/api/v2/reservation/{reservationId}'>;
export type ReserveTerm = Res<'/api/v2/reservation/terms'>[number];
// 요청 바디 — 응답과 달리 optional이 "생략 가능"이라 Res를 쓰지 않는다.
export type ReservationPostBody = components['schemas']['ReserveRequest'];

/* ── 관리자 ─────────────────────────────────────────────── */

export type SlidePreviewList = Res<'/api/v2/admin/slide'>;
export type SlidePreview = SlidePreviewList['slides'][number];
export type ImportantPreviewList = Res<'/api/v2/admin/important'>;
export type ImportantPreview = ImportantPreviewList['importants'][number];
export type ImageModal = Res<'/api/v2/image-modal'>[number];

/* ── 구성원 ─────────────────────────────────────────────── */

export type FacultyList = Res<'/api/v2/professor/active'>;
export type SimpleFaculty = FacultyList['professors'][number];
// 편집·상세가 쓰는 응답. 공유값은 최상위, 언어별 값만 ko/en 안에.
export type ProfessorWithLanguage = Res<'/api/v2/professor/{professorId}'>;
export type Faculty = NonNullable<ProfessorWithLanguage['ko']>;
// 상세 화면이 쓰는 모양 — 공유값과 해당 언어 번역본을 합친 것.
export type FacultyDetail = Omit<ProfessorWithLanguage, 'ko' | 'en'> & Faculty;
export type SimpleEmeritusFaculty = Res<'/api/v2/professor/inactive'>[number];

export type SimpleStaff = Res<'/api/v2/staff'>[number];
// 편집·상세 화면이 쓰는 응답. 공유값은 최상위, 언어별 값만 ko/en 안에 있다.
export type StaffWithLanguage = Res<'/api/v2/staff/{staffId}'>;
export type Staff = NonNullable<StaffWithLanguage['ko']>;

export type ProfessorPostBody =
  components['schemas']['CreateProfessorLanguagesReqBody'];
export type ProfessorPutBody =
  components['schemas']['ModifyProfessorLanguagesReqBody'];
export type StaffPostBody =
  components['schemas']['CreateStaffLanguagesReqBody'];
export type StaffPutBody = components['schemas']['ModifyStaffLanguagesReqBody'];

/* ── 입학 ───────────────────────────────────────────────── */

export type AdmissionsResponse =
  Res<'/api/v2/admissions/{mainType}/{postType}'>;
export type AdmissionsMainType = Param<
  '/api/v2/admissions/{mainType}/{postType}',
  'mainType'
>;
export type AdmissionsPostType = Param<
  '/api/v2/admissions/{mainType}/{postType}',
  'postType'
>;

/* ── 소개 ───────────────────────────────────────────────── */

export type AboutContent = Res<'/api/v2/about/{postType}'>;
export type DirectionsResponse = Res<'/api/v2/about/directions'>;
export type FacilitiesResponse = Res<'/api/v2/about/facilities'>;
export type Facility = FacilitiesResponse[number]['ko'];
export type StudentClubsResponse = Res<'/api/v2/about/student-clubs'>;
export type Club = StudentClubsResponse[number]['ko'];
export type FutureCareersResponse = Res<'/api/v2/about/future-careers'>;
export type YearStat = FutureCareersResponse['stat'][number];
export type Company = FutureCareersResponse['companies'][number];

/* ── 학사 ───────────────────────────────────────────────── */

export type Guide = Res<'/api/v2/academics/{studentType}/guide'>;
export type DegreeRequirements =
  Res<'/api/v2/academics/undergraduate/degree-requirements'>;
export type TimelineContent =
  Res<'/api/v2/academics/{studentType}/{postType}'>[number];
export type Course = Res<'/api/v2/academics/courses'>[number];
export type ScholarshipList =
  Res<'/api/v2/academics/{studentType}/scholarship'>;
// 백엔드가 Kotlin Pair<ScholarshipDto, ScholarshipDto>를 반환해 `{first, second}`로 나온다.
// loader가 language 필드를 보고 ko/en으로 가른다.
export type Scholarship =
  Res<'/api/v2/academics/scholarship/{scholarshipId}'>['first'];

export type StudentType = Param<
  '/api/v2/academics/{studentType}/scholarship',
  'studentType'
>;

/* ── 연구 ───────────────────────────────────────────────── */

// `/research/{researchType}`는 oneOf라 경로에서 분기별로 꺼낼 수 없다 — 스키마로 직접 지정.
// 둘 다 응답 전용 스키마다.
type ResearchCenter = components['schemas']['ResearchCenterDto'];
export type ResearchCentersResponse = ResearchCenter[];
export type ResearchGroup = components['schemas']['ResearchGroupDto'];
export type ResearchGroupsResponse = ResearchGroup[];

export type SimpleResearchLab = Res<'/api/v2/research/lab'>[number];
export type ResearchLabWithLanguage = Res<'/api/v2/research/lab/{labId}'>;
type ResearchLab = NonNullable<ResearchLabWithLanguage['ko']>;
// 상세 화면이 쓰는 모양 — 공유값과 해당 언어 번역본을 합친 것.
export type ResearchLabDetail = Omit<ResearchLabWithLanguage, 'ko' | 'en'> &
  ResearchLab;

// 요청 바디. 한/영이 공유하는 값(소속·연락처·종류)은 최상위에 있고
// 언어별 값만 ko/en 안에 있다 — 폼이 이 타입을 달고 있어야 백엔드가 바뀔 때 컴파일이 막는다.
// 편집 화면이 쓰는 응답 — 공유값은 최상위, 이름·설명만 ko/en 안에.
export type ResearchWithLanguage = Res<'/api/v2/research/{researchId}'>;

export type ResearchPostBody =
  components['schemas']['CreateResearchLanguageReqBody'];
export type ResearchPutBody =
  components['schemas']['ModifyResearchLanguageReqBody'];
export type LabPostBody = components['schemas']['CreateLabLanguageReqBody'];
export type LabPutBody = components['schemas']['ModifyLabLanguageReqBody'];

/* ── 통합 검색 ──────────────────────────────────────────── */
// 통합검색 화면은 `/totalSearch` 한 번으로 전 도메인 상위 N개를 받는다.
// 도메인별 결과 타입은 그 응답에서 파생한다 — 개별 `/search/top`이 아니라.

export type TotalSearchResult = Res<'/api/v2/totalSearch'>;
export type AboutSearchResult = TotalSearchResult['aboutResult'];
export type AboutPreview = AboutSearchResult['results'][number];
export type NoticeSearchResult = TotalSearchResult['noticeResult'];
export type NewsSearchResult = TotalSearchResult['newsResult'];
export type MemberSearchResult = TotalSearchResult['memberResult'];
export type Member = MemberSearchResult['results'][number];
export type ResearchSearchResult = TotalSearchResult['researchResult'];
export type AcademicsSearchResult = TotalSearchResult['academicsResult'];
export type Academic = AcademicsSearchResult['results'][number];
export type AdmissionsSearchResult = TotalSearchResult['admissionsResult'];
export type ResearchType =
  ResearchSearchResult['results'][number]['researchType'];
