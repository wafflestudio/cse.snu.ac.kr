import type {
  LabPostBody,
  ProfessorPostBody,
  ResearchPostBody,
} from '@/types/api';
import { postJson, postMultipart } from './client';

/**
 * research 도메인 baseline 데이터 + 시더.
 *
 * ⚠️ 요청 본문에는 반드시 스키마 타입(*PostBody)을 붙인다. 붙이지 않으면 백엔드 요청
 * 모양이 바뀌어도 typecheck 가 통과하고, globalSetup 이 400 으로 죽어서야 알게 된다.
 *
 * RESEARCH_SEED: research 계열 read 스펙이 검증에 쓰는 기대값 단일 출처.
 * seedResearch: 그룹 → 교수 → 연구실 순으로 심습니다(연구실이 그룹·교수를 참조).
 *
 * 새 도메인은 이 파일을 본떠 seed/<domain>.ts 를 만들고 seed/index.ts에 등록하세요.
 */
export const RESEARCH_SEED = {
  group: { ko: '시스템', en: 'System' },
  center: {
    ko: '인공지능 연구센터',
    en: 'AI Research Center',
    website: 'https://ai-center.example.com',
  },
  // Top Conference List(이름순 정렬 → ICSE가 위). 페이지가 language를 무시해 ko/en 동일.
  conferences: [
    {
      abbreviation: 'ICSE',
      name: 'International Conference on Software Engineering',
    },
    { abbreviation: 'NeurIPS', name: 'Neural Information Processing Systems' },
  ],
  professors: [
    { ko: '김철수', en: 'Chulsoo Kim' },
    { ko: '이영희', en: 'Younghee Lee' },
  ],
  labs: [
    {
      ko: '지능형 데이터 시스템 연구실',
      en: 'Intelligent Data Systems Lab',
      acronym: 'IDS',
      location: { ko: '301동 501호', en: 'Bldg 301, Room 501' },
      tel: '02-880-0001',
    },
    {
      ko: '컴퓨터 구조 연구실',
      en: 'Computer Architecture Lab',
      acronym: 'ARC',
      location: { ko: '301동 502호', en: 'Bldg 301, Room 502' },
      tel: '02-880-0002',
    },
  ],
} as const;

// 한/영은 이제 한 부모 아래의 번역본이라 생성 응답이 id 하나를 돌려준다.
type Created = { id: number };

function professorTranslation(
  name: string,
  isKo: boolean,
): ProfessorPostBody['ko'] {
  return {
    name,
    academicRank: isKo ? '교수' : 'Professor',
    department: isKo ? '컴퓨터공학부' : 'CSE',
    office: null,
    educations: [],
    researchAreas: [],
    careers: [],
  };
}

export async function seedResearch(cookie: string) {
  // 종류·웹사이트처럼 언어와 무관한 값은 최상위에, 이름·설명만 ko/en 안에.
  const groupBody: ResearchPostBody = {
    type: 'groups',
    ko: {
      name: RESEARCH_SEED.group.ko,
      description: '<p>시스템 연구 그룹</p>',
    },
    en: {
      name: RESEARCH_SEED.group.en,
      description: '<p>Systems research group</p>',
    },
  };
  const group = await postMultipart<Created>(
    cookie,
    '/api/v2/research',
    groupBody,
  );

  const centerBody: ResearchPostBody = {
    type: 'centers',
    websiteURL: RESEARCH_SEED.center.website,
    ko: {
      name: RESEARCH_SEED.center.ko,
      description: '<p>인공지능 연구센터 소개</p>',
    },
    en: {
      name: RESEARCH_SEED.center.en,
      description: '<p>AI Research Center intro</p>',
    },
  };
  await postMultipart(cookie, '/api/v2/research', centerBody);

  const professors: Created[] = [];
  for (const p of RESEARCH_SEED.professors) {
    const body: ProfessorPostBody = {
      status: 'ACTIVE',
      labId: null,
      startDate: null,
      endDate: null,
      phone: null,
      fax: null,
      email: null,
      website: null,
      ko: professorTranslation(p.ko, true),
      en: professorTranslation(p.en, false),
    };
    professors.push(
      await postMultipart<Created>(cookie, '/api/v2/professor', body),
    );
  }

  for (let i = 0; i < RESEARCH_SEED.labs.length; i++) {
    const lab = RESEARCH_SEED.labs[i];
    const prof = professors[i];
    // 약칭은 실측상 한/영이 같아 공유값으로, 위치는 언어별로 남았다.
    const body: LabPostBody = {
      groupId: group.id,
      professorIds: [prof.id],
      acronym: lab.acronym,
      tel: lab.tel,
      youtube: null,
      websiteURL: 'https://example.com',
      ko: {
        name: lab.ko,
        description: `<p>${lab.ko} 설명</p>`,
        location: lab.location.ko,
      },
      en: {
        name: lab.en,
        description: `<p>${lab.en} description</p>`,
        location: lab.location.en,
      },
    };
    await postMultipart(cookie, '/api/v2/research/lab', body);
  }

  // Top Conference List: conference_page 행(seed-content.sh)에 conference 추가(PATCH).
  // 이 PATCH가 author를 staff 유저로 설정 → 이후 GET이 author.name을 정상 반환.
  await postJson(
    cookie,
    '/api/v2/conference/page/conferences',
    {
      newConferenceList: RESEARCH_SEED.conferences.map((c) => ({
        language: 'ko',
        abbreviation: c.abbreviation,
        name: c.name,
      })),
      modifiedConferenceList: [],
      deleteConferenceIdList: [],
    },
    'PATCH',
  );
}
