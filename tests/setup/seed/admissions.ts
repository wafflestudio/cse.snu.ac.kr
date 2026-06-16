/**
 * admissions 콘텐츠 싱글톤(main_type/post_type별 ko/en)의 기대값.
 *
 * PUT만 있고 생성 API가 없어(빈 DB면 404) `tests/setup/seed-content.sh`가 SQL로 직접 시드한다.
 * 아래 텍스트는 seed-content.sh의 seed_admissions 인자와 일치해야 한다.
 * admissions는 GET이 {ko,en}을 모두 반환 → 정상 다국어(페이지가 locale별 description 사용).
 *
 * 키는 라우트 경로(mainType/postType).
 */
export const ADMISSIONS_SEED = {
  'undergraduate/regular-admission': {
    ko: '학부 정시 모집 안내입니다.',
    en: 'Undergraduate regular admission.',
  },
  'undergraduate/early-admission': {
    ko: '학부 수시 모집 안내입니다.',
    en: 'Undergraduate early admission.',
  },
  'graduate/regular-admission': {
    ko: '대학원 모집 안내입니다.',
    en: 'Graduate admission.',
  },
  'international/undergraduate': {
    ko: '외국인 학부 모집 안내입니다.',
    en: 'International undergraduate.',
  },
  'international/graduate': {
    ko: '외국인 대학원 모집 안내입니다.',
    en: 'International graduate.',
  },
  'international/exchange': {
    ko: '교환·방문 학생 안내입니다.',
    en: 'Exchange and visiting students.',
  },
  'international/scholarships': {
    ko: '외국인 장학 안내입니다.',
    en: 'International scholarships.',
  },
} as const;
