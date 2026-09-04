import { HTTPError, TimeoutError } from 'ky';
import type { components } from '@/types/api/generated';

type Locale = 'ko' | 'en';
type Text = Record<Locale, string>;

/** 백엔드 오류 코드. 스펙(ErrorResponse.code)에서 생성되므로 백엔드 enum 과 항상 같다. */
type ErrorCode = components['schemas']['ErrorResponse']['code'];

/**
 * 코드 → 사용자 문구. 백엔드는 코드만 보내고 문구는 여기서 조립한다.
 * `Record<ErrorCode, …>` 라 백엔드에 코드가 늘면 여기가 컴파일에서 깨진다 — 번역 누락을 막는 장치다.
 */
const MESSAGES: Record<ErrorCode, Text> = {
  'SYS-00': {
    ko: '서버에 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.',
    en: 'Something went wrong on the server. Please try again shortly.',
  },
  'SYS-01': {
    ko: '이미 같은 값이 있습니다.',
    en: 'That value already exists.',
  },
  'SYS-02': {
    ko: '입력값이 올바르지 않습니다.',
    en: 'Some inputs are invalid.',
  },
  'SYS-03': {
    ko: '로그인 서버에 연결하지 못했습니다.',
    en: 'Could not reach the login server.',
  },
  'SYS-04': { ko: '요청 형식이 올바르지 않습니다.', en: 'Malformed request.' },
  'SYS-05': {
    ko: '지원하지 않는 요청 형식입니다.',
    en: 'Unsupported request format.',
  },
  'SYS-06': { ko: '없는 경로입니다.', en: 'Not found.' },
  'SYS-07': {
    // 로그인은 전체 페이지 이동(OAuth)이라 작성 중인 내용이 사라진다 — 복사부터 안내한다.
    ko: '로그인이 풀렸습니다. 작성 중인 내용을 복사해 두고 다시 로그인해 주세요.',
    en: 'Your session has expired. Copy anything you have written, then sign in again.',
  },
  'SYS-08': { ko: '권한이 없습니다.', en: 'You do not have permission.' },
  'SYS-09': { ko: '허용되지 않는 값입니다.', en: 'That value is not allowed.' },
  'SYS-10': {
    ko: '요청한 언어와 데이터의 언어가 다릅니다.',
    en: 'The requested language does not match the data.',
  },
  'SYS-11': {
    ko: '비공개 글입니다. 교직원만 볼 수 있습니다.',
    en: 'This post is private and visible to staff only.',
  },
  'SYS-12': {
    ko: '검색 색인에 문제가 있습니다. 관리자에게 알려주세요.',
    en: 'The search index is inconsistent. Please notify an administrator.',
  },
  'SYS-13': {
    ko: '허용되지 않는 요청 방식입니다.',
    en: 'That request method is not allowed.',
  },
  'SYS-14': {
    ko: '요청한 형식으로 응답할 수 없습니다.',
    en: 'Cannot respond in the requested format.',
  },
  'SYS-15': {
    ko: '파일 용량이 너무 큽니다.',
    en: 'The file is too large.',
  },
  'SYS-16': {
    ko: '서버가 일시적으로 응답할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    en: 'The server is temporarily unavailable. Please try again shortly.',
  },
  'NOTICE-01': { ko: '공지사항을 찾을 수 없습니다.', en: 'Notice not found.' },
  'NOTICE-02': { ko: '없는 공지 태그입니다.', en: 'Unknown notice tag.' },
  'NEWS-01': { ko: '새소식을 찾을 수 없습니다.', en: 'News not found.' },
  'NEWS-02': { ko: '없는 새소식 태그입니다.', en: 'Unknown news tag.' },
  'SEMINAR-01': { ko: '세미나를 찾을 수 없습니다.', en: 'Seminar not found.' },
  'CONFERENCE-01': {
    ko: '학회를 찾을 수 없습니다.',
    en: 'Conference not found.',
  },
  'INTERNAL-01': {
    ko: '내부 페이지를 찾을 수 없습니다.',
    en: 'Internal page not found.',
  },
  'ADMISSIONS-01': {
    ko: '입학 안내 페이지를 찾을 수 없습니다.',
    en: 'Admissions page not found.',
  },
  'IMAGEMODAL-01': {
    ko: '이미지 모달을 찾을 수 없습니다.',
    en: 'Image modal not found.',
  },
  'ABOUT-01': { ko: '시설을 찾을 수 없습니다.', en: 'Facility not found.' },
  'ABOUT-02': { ko: '동아리를 찾을 수 없습니다.', en: 'Club not found.' },
  'ABOUT-03': { ko: '회사를 찾을 수 없습니다.', en: 'Company not found.' },
  'ABOUT-04': {
    ko: '찾아오는 길 항목을 찾을 수 없습니다.',
    en: 'Directions entry not found.',
  },
  'ABOUT-05': {
    ko: '해당 연도 통계가 이미 있습니다.',
    en: 'Statistics for that year already exist.',
  },
  'ABOUT-07': { ko: '소개 글을 찾을 수 없습니다.', en: 'Page not found.' },
  'ABOUT-06': {
    ko: '통계 항목을 전부 입력해 주세요.',
    en: 'Please fill in every statistics row.',
  },
  'ACADEMICS-01': {
    ko: '학사 글을 찾을 수 없습니다.',
    en: 'Academics post not found.',
  },
  'ACADEMICS-02': { ko: '안내를 찾을 수 없습니다.', en: 'Guide not found.' },
  'ACADEMICS-03': {
    ko: '졸업 요건을 찾을 수 없습니다.',
    en: 'Degree requirements not found.',
  },
  'ACADEMICS-04': { ko: '교과목을 찾을 수 없습니다.', en: 'Course not found.' },
  'ACADEMICS-05': {
    ko: '같은 학수번호의 교과목이 이미 있습니다.',
    en: 'A course with that code already exists.',
  },
  'ACADEMICS-06': {
    ko: '장학제도를 찾을 수 없습니다.',
    en: 'Scholarship not found.',
  },
  'ACADEMICS-07': {
    ko: '해당 연도 항목이 이미 있습니다.',
    en: 'An entry for that year already exists.',
  },
  'MEMBER-01': { ko: '교수를 찾을 수 없습니다.', en: 'Professor not found.' },
  'MEMBER-02': {
    ko: '교수의 한·영 정보 쌍을 찾을 수 없습니다.',
    en: 'Professor language pair not found.',
  },
  'MEMBER-03': {
    ko: '행정직원을 찾을 수 없습니다.',
    en: 'Staff member not found.',
  },
  'MEMBER-04': {
    ko: '행정직원의 한·영 정보 쌍을 찾을 수 없습니다.',
    en: 'Staff language pair not found.',
  },
  'RESEARCH-01': {
    ko: '연구 글을 찾을 수 없습니다.',
    en: 'Research post not found.',
  },
  'RESEARCH-02': {
    ko: '연구 글의 한·영 쌍을 찾을 수 없습니다.',
    en: 'Research language pair not found.',
  },
  'RESEARCH-03': {
    ko: '한글·영문 글의 종류(그룹/센터)가 서로 다릅니다.',
    en: 'The Korean and English posts are of different kinds.',
  },
  'RESEARCH-04': {
    ko: '연구 그룹을 찾을 수 없습니다.',
    en: 'Research group not found.',
  },
  'RESEARCH-05': {
    ko: '연구 그룹이 아닌 글입니다.',
    en: 'That post is not a research group.',
  },
  'RESEARCH-06': { ko: '연구실을 찾을 수 없습니다.', en: 'Lab not found.' },
  'RESEARCH-07': {
    ko: '연구실의 한·영 쌍을 찾을 수 없습니다.',
    en: 'Lab language pair not found.',
  },
  'RESEARCH-08': {
    ko: '목록에 없는 교수가 포함돼 있습니다.',
    en: 'One or more professors were not found.',
  },
  'RESEARCH-09': {
    ko: '이미 다른 연구실에 속한 교수입니다.',
    en: 'That professor already belongs to another lab.',
  },
  'FILE-01': {
    ko: '첨부파일을 찾을 수 없습니다.',
    en: 'Attachment not found.',
  },
  'FILE-02': {
    ko: '대표이미지는 jpg, jpeg, png 파일만 올릴 수 있습니다.',
    en: 'The main image must be a jpg, jpeg, or png file.',
  },
  'RESERVE-01': { ko: '강의실을 찾을 수 없습니다.', en: 'Room not found.' },
  'RESERVE-02': {
    ko: '일반 예약 권한으로는 세미나실만 예약할 수 있습니다.',
    en: 'General reservation accounts can only book seminar rooms.',
  },
  'RESERVE-03': {
    ko: '교수회의실은 교직원 또는 교수만 예약할 수 있습니다.',
    en: 'The faculty meeting room can only be booked by staff or faculty.',
  },
  'RESERVE-04': {
    ko: '정기예약 기간에는 랩 대표만 예약할 수 있습니다.',
    en: 'During the regular reservation period only lab representatives can book.',
  },
  'RESERVE-05': {
    ko: '정기예약은 지정된 학기 안에서만 가능합니다.',
    en: 'Regular reservations must fall within the designated semester.',
  },
  'RESERVE-06': {
    ko: '교직원이 아닌 예약은 같은 날짜 안에서 회차당 최대 3시간까지 가능합니다.',
    en: 'Non-staff reservations are limited to 3 hours per slot within a single day.',
  },
  'RESERVE-07': {
    ko: '아직 등록되지 않은 기간은 예약할 수 없습니다.',
    en: 'That period is not open for reservations yet.',
  },
  'RESERVE-08': {
    ko: '정기예약 신청 기간이 아직 시작되지 않았습니다.',
    en: 'The regular reservation application period has not started.',
  },
  'RESERVE-09': {
    ko: '해당 시간에 이미 예약이 있습니다.',
    en: 'That time slot is already reserved.',
  },
  'RESERVE-10': {
    ko: '반복 예약 횟수가 올바르지 않습니다.',
    en: 'Invalid number of recurring weeks.',
  },
  'RESERVE-11': {
    ko: '수시 예약은 반복할 수 없습니다.',
    en: 'One-time reservations cannot recur.',
  },
  'RESERVE-12': {
    ko: '수시 예약 가능 기간이 아직 시작되지 않았습니다.',
    en: 'The one-time reservation period has not started.',
  },
  'RESERVE-13': {
    ko: '지난 시각은 예약할 수 없습니다.',
    en: 'Past times cannot be reserved.',
  },
  'RESERVE-14': {
    ko: '정기예약 신청 기간이 끝났습니다.',
    en: 'The regular reservation application period has ended.',
  },
  'RESERVE-15': {
    ko: '종료 시각은 시작 시각 이후여야 합니다.',
    en: 'End time must be after start time.',
  },
  'RESERVE-16': {
    ko: '예약 권한이 없습니다.',
    en: 'No reservation permission.',
  },
  'RESERVE-17': {
    ko: '지원하지 않는 예약 날짜 범위입니다.',
    en: 'Unsupported reservation date range.',
  },
  'RESERVE-18': {
    ko: '예약을 찾을 수 없습니다.',
    en: 'Reservation not found.',
  },
  'RESERVE-19': {
    ko: '다른 사람의 예약은 취소할 수 없습니다.',
    en: 'You cannot cancel someone else’s reservation.',
  },
  'RESERVE-20': {
    ko: '예약 규정에 동의해 주세요.',
    en: 'Please agree to the reservation policy.',
  },
  'RESERVE-21': {
    ko: '예약 기간이 다른 기간과 겹칩니다.',
    en: 'The reservation period overlaps another one.',
  },
};

/** 백엔드가 아니라 프론트가 판정하는 실패. 백엔드에 닿지 못했거나 백엔드가 답한 게 아닐 때. */
const CLIENT_MESSAGES = {
  network: {
    ko: '네트워크 연결을 확인하고 다시 시도해 주세요.',
    en: 'Please check your network connection and try again.',
  },
  timeout: {
    ko: '서버 응답이 늦습니다. 잠시 후 다시 시도해 주세요.',
    en: 'The server is slow to respond. Please try again shortly.',
  },
  unreachable: {
    ko: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    en: 'Cannot reach the server. Please try again shortly.',
  },
  unknownCode: {
    ko: '요청을 처리하지 못했습니다.',
    en: 'The request could not be processed.',
  },
  unexpected: {
    ko: '문제가 생겼습니다. 잠시 후 다시 시도해 주세요.',
    en: 'Something went wrong. Please try again shortly.',
  },
} satisfies Record<string, Text>;

type ErrorBody = components['schemas']['ErrorResponse'];

function errorBody(error: HTTPError): ErrorBody | null {
  const data = error.data as Partial<ErrorBody> | undefined;
  return data && typeof data === 'object' && typeof data.code === 'string'
    ? (data as ErrorBody)
    : null;
}

/** 토스트는 훅 밖에서 뜨므로 URL 프리픽스로 로케일을 읽는다(useLanguage 와 같은 규칙). */
function currentLocale(): Locale {
  if (typeof window === 'undefined') return 'ko';
  return window.location.pathname.startsWith('/en') ? 'en' : 'ko';
}

/**
 * 어떤 실패든 사용자에게 보여줄 한 문장으로.
 * 백엔드 코드 → 사전, 그 외는 실패의 종류(네트워크·타임아웃·서버 미도달·모르는 코드)로 문구를 정한다.
 * 호출부가 문구를 넘길 필요가 없다 — 사용자는 방금 무엇을 눌렀는지 이미 안다.
 */
export function apiErrorMessage(
  error: unknown,
  locale: Locale = currentLocale(),
): string {
  if (error instanceof TimeoutError) return CLIENT_MESSAGES.timeout[locale];
  if (error instanceof HTTPError) {
    const body = errorBody(error);
    if (!body) return CLIENT_MESSAGES.unreachable[locale]; // 엣지(Caddy)가 낸 5xx 등, 우리 계약이 아닌 응답
    const known = (MESSAGES as Record<string, Text | undefined>)[body.code];
    if (!known) return `${CLIENT_MESSAGES.unknownCode[locale]} (${body.code})`; // 배포 간극의 버전 어긋남
    return known[locale];
  }
  if (error instanceof TypeError) return CLIENT_MESSAGES.network[locale]; // fetch 가 실패하면 TypeError
  return CLIENT_MESSAGES.unexpected[locale];
}
