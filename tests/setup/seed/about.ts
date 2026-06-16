import { postJson, postMultipart } from './client';

/**
 * about content 싱글톤(overview/greetings/history/contact)의 기대값.
 *
 * 이 콘텐츠는 API 생성 경로가 없어 `tests/setup/seed-content.sh`가 SQL로 직접 시드한다.
 * 아래 텍스트는 **seed-content.sh의 본문과 일치해야 한다**(둘을 함께 수정).
 * (편집-only라 별도 seeder 함수 없음 — read 스펙이 이 상수를 참조)
 */
export const ABOUT_SEED = {
  overview: { ko: '학부 소개 본문입니다.', en: 'Department overview.' },
  greetings: { ko: '학부장 인사말입니다.', en: 'Greetings from the chair.' },
  history: { ko: '학부 연혁입니다.', en: 'Department history.' },
  contact: { ko: '연락처 안내입니다.', en: 'Contact information.' },
} as const;

/**
 * 찾아오는 길(directions). PUT만 있고 생성 API가 없는 멀티-행 콘텐츠라
 * `seed-content.sh`가 SQL로 직접 시드한다(행마다 name 필요). 아래 텍스트는
 * seed-content.sh의 seed_direction 인자와 일치해야 한다(둘을 함께 수정).
 * koName 오름차순(대중교통 < 자가용)이 기본 선택 순서.
 */
export const DIRECTIONS_SEED = [
  {
    ko: { name: '대중교통', description: '지하철 2호선 서울대입구역에서 버스 환승.' },
    en: { name: 'By Public Transit', description: 'Subway Line 2 to SNU Station, then bus.' },
  },
  {
    ko: { name: '자가용', description: '관악 캠퍼스 정문으로 진입.' },
    en: { name: 'By Car', description: 'Enter via the Gwanak main gate.' },
  },
] as const;

/** 학생 동아리(API 생성 가능). read 스펙이 참조. */
export const CLUBS_SEED = [
  { ko: '컴퓨터연구회', en: 'Computer Research Club' },
  { ko: '알고리즘 동아리', en: 'Algorithm Club' },
] as const;

export async function seedClubs(cookie: string) {
  for (const c of CLUBS_SEED) {
    await postMultipart(cookie, '/api/v2/about/student-clubs', {
      ko: { name: c.ko, description: `<p>${c.ko} 소개</p>` },
      en: { name: c.en, description: `<p>${c.en} intro</p>` },
    });
  }
}

/** 시설(API 생성 가능). read 스펙이 참조. */
export const FACILITIES_SEED = [
  { ko: '대형 강의실', en: 'Large Lecture Hall' },
  { ko: '세미나실', en: 'Seminar Room' },
] as const;

export async function seedFacilities(cookie: string) {
  for (const f of FACILITIES_SEED) {
    await postMultipart(cookie, '/api/v2/about/facilities', {
      ko: {
        name: f.ko,
        description: `<p>${f.ko} 소개</p>`,
        locations: ['301동'],
      },
      en: {
        name: f.en,
        description: `<p>${f.en} intro</p>`,
        locations: ['Bldg 301'],
      },
    });
  }
}

/**
 * 졸업생 진로(future-careers): description 싱글톤 + 연도별 통계(stat) + 창업 기업(company).
 *
 * - description: PUT만 있는 content 싱글톤(빈 DB GET이 500) → seed-content.sh가 SQL로 시드.
 *   `FUTURE_CAREERS_SEED.description` 텍스트는 seed-content.sh의 FUTURE_CAREERS 본문과 일치해야 함.
 * - stat/company: JSON `@RequestBody` 생성 API(postJson). 아래 seedFutureCareers가 시드.
 */
const CAREER_LIST = [
  'SAMSUNG',
  'LG',
  'LARGE',
  'SMALL',
  'GRADUATE',
  'OTHER',
] as const;

export const FUTURE_CAREERS_SEED = {
  description: {
    ko: '졸업생 진로 안내 본문입니다.',
    en: 'Career paths overview.',
  },
  statYear: 2024,
  companies: [
    { name: '에이아이비전', url: 'https://aivision.example.com', year: 2020 },
    { name: '데이터스케이프', url: 'https://datascape.example.com', year: 2021 },
  ],
} as const;

export async function seedFutureCareers(cookie: string) {
  // description은 content 싱글톤이라 SQL(seed-content.sh)이 시드. 여기선 stat/company만.
  await postJson(cookie, '/api/v2/about/future-careers/stats', {
    year: FUTURE_CAREERS_SEED.statYear,
    statList: CAREER_LIST.map((career, i) => ({
      career,
      bachelor: (i + 1) * 5,
      master: (i + 1) * 2,
      doctor: i + 1,
    })),
  });
  for (const c of FUTURE_CAREERS_SEED.companies) {
    await postJson(cookie, '/api/v2/about/future-careers/company', c);
  }
}
