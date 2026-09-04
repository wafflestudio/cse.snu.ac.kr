import type { ProfessorPostBody, StaffPostBody } from '@/types/api';
import { postMultipart } from './client';

/**
 * people 도메인 baseline.
 * - 교수진(faculty/ACTIVE)은 seed/research.ts가 이미 시드(연구실이 참조).
 * - 여기선 명예교수(emeritus = professor status INACTIVE)와 행정직원(staff)을 시드.
 *
 * 전화·이메일은 사람에게 하나뿐이라 요청 최상위에, 위치(office)는 주소 표기가
 * 언어마다 달라 ko/en 안에 있다.
 *
 * ⚠️ 요청 본문에는 반드시 스키마 타입(*PostBody)을 붙인다 — 안 붙이면 백엔드가
 * 바뀌어도 typecheck 를 통과하고 globalSetup 400 으로 죽어서야 알게 된다.
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

// 언어별로 다른 값만 담는다. 신분·전화·이메일은 사람에게 하나뿐이라 요청 최상위에 있다.
function emeritusTranslation(
  name: string,
  isKo: boolean,
): ProfessorPostBody['ko'] {
  return {
    name,
    academicRank: isKo ? '명예교수' : 'Emeritus Professor',
    department: isKo ? '컴퓨터공학부' : 'CSE',
    office: null,
    educations: [],
    researchAreas: [],
    careers: [],
  };
}

export async function seedPeople(cookie: string) {
  const emeritus: ProfessorPostBody = {
    status: 'INACTIVE',
    labId: null,
    startDate: null,
    endDate: null,
    phone: null,
    fax: null,
    email: EMERITUS_SEED.email,
    website: null,
    ko: emeritusTranslation(EMERITUS_SEED.ko, true),
    en: emeritusTranslation(EMERITUS_SEED.en, false),
  };
  await postMultipart(cookie, '/api/v2/professor', emeritus);

  const staff: StaffPostBody = {
    phone: STAFF_SEED.ko.phone,
    email: STAFF_SEED.ko.email,
    ko: {
      name: STAFF_SEED.ko.name,
      role: STAFF_SEED.ko.role,
      office: STAFF_SEED.ko.office,
      tasks: [...STAFF_SEED.ko.tasks],
    },
    en: {
      name: STAFF_SEED.en.name,
      role: STAFF_SEED.en.role,
      office: STAFF_SEED.en.office,
      tasks: [...STAFF_SEED.en.tasks],
    },
  };
  await postMultipart(cookie, '/api/v2/staff', staff);
}
