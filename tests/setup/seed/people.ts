import { postMultipart } from './client';

/**
 * people 도메인 baseline.
 * - 교수진(faculty/ACTIVE)은 seed/research.ts가 이미 시드(연구실이 참조).
 * - 여기선 명예교수(emeritus = professor status INACTIVE)와 행정직원(staff)을 시드.
 *
 * 주의(백엔드 동작): 교수 생성은 en 레코드도 ko 이름으로 저장한다(en.name 무시).
 * → emeritus en 목록도 한글 이름이 렌더된다. read 스펙은 ko 이름을 기대값으로 쓴다.
 */
export const EMERITUS_SEED = {
  ko: '박명예',
  en: 'Myungye Park',
  email: 'emeritus@snu.ac.kr',
} as const;

export const STAFF_SEED = {
  ko: {
    name: '최행정',
    role: '행정실장',
    office: '301동 316호',
    phone: '02-880-1234',
    email: 'staff@snu.ac.kr',
    tasks: ['학사 업무'],
  },
  en: {
    name: 'Haengjeong Choi',
    role: 'Head of Administration',
    office: 'Bldg 301, Rm 316',
    phone: '02-880-1234',
    email: 'staff@snu.ac.kr',
    tasks: ['Academic affairs'],
  },
} as const;

function emeritusBody(name: string, isKo: boolean) {
  return {
    name,
    status: 'INACTIVE',
    academicRank: isKo ? '명예교수' : 'Emeritus Professor',
    department: isKo ? '컴퓨터공학부' : 'CSE',
    labId: null,
    startDate: null,
    endDate: null,
    office: null,
    phone: null,
    fax: null,
    email: EMERITUS_SEED.email,
    website: null,
    educations: [],
    researchAreas: [],
    careers: [],
  };
}

export async function seedPeople(cookie: string) {
  await postMultipart(cookie, '/api/v2/professor', {
    ko: emeritusBody(EMERITUS_SEED.ko, true),
    en: emeritusBody(EMERITUS_SEED.en, false),
  });

  await postMultipart(cookie, '/api/v2/staff', {
    ko: STAFF_SEED.ko,
    en: STAFF_SEED.en,
  });
}
