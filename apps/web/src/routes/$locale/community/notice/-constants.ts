/** 공지 태그 목록(필터·편집기 공용). 백엔드 enrollTag와 문자열이 일치해야 한다. */
export const NOTICE_TAGS = [
  '수업',
  '장학',
  '학부',
  '대학원',
  '다전공/전과',
  '등록/복학/휴학/재입학',
  '입학',
  '졸업',
  '채용정보',
  '교환학생/유학',
  '외부행사/프로그램',
  '내부행사/프로그램',
  'international',
  '공모전/대회',
  '시설/생활',
];

/** 이 태그를 단 공지는 공지사항 목록에서 빠지고 채용정보 페이지(/community/jobs)에만 모인다. */
export const JOB_NOTICE_TAG = '채용정보';

/** 공지사항 목록의 태그 필터. 채용정보는 따로 페이지가 있어 뺀다(편집기는 NOTICE_TAGS 그대로). */
export const NOTICE_FILTER_TAGS = NOTICE_TAGS.filter(
  (t) => t !== JOB_NOTICE_TAG,
);
