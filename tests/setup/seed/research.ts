import { postJson, postMultipart } from './client';

/**
 * research 도메인 baseline 데이터 + 시더.
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
    { abbreviation: 'ICSE', name: 'International Conference on Software Engineering' },
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

type LangPair = { ko: { id: number }; en: { id: number } };

function professorBody(name: string, isKo: boolean) {
  return {
    name,
    status: 'ACTIVE',
    academicRank: isKo ? '교수' : 'Professor',
    department: isKo ? '컴퓨터공학부' : 'CSE',
    labId: null,
    startDate: null,
    endDate: null,
    office: null,
    phone: null,
    fax: null,
    email: null,
    website: null,
    educations: [],
    researchAreas: [],
    careers: [],
  };
}

export async function seedResearch(cookie: string) {
  const group = await postMultipart<LangPair>(cookie, '/api/v2/research', {
    ko: {
      type: 'groups',
      name: RESEARCH_SEED.group.ko,
      description: '<p>시스템 연구 그룹</p>',
      mainImageUrl: null,
    },
    en: {
      type: 'groups',
      name: RESEARCH_SEED.group.en,
      description: '<p>Systems research group</p>',
      mainImageUrl: null,
    },
  });

  await postMultipart(cookie, '/api/v2/research', {
    ko: {
      type: 'centers',
      name: RESEARCH_SEED.center.ko,
      description: '<p>인공지능 연구센터 소개</p>',
      websiteURL: RESEARCH_SEED.center.website,
      mainImageUrl: null,
    },
    en: {
      type: 'centers',
      name: RESEARCH_SEED.center.en,
      description: '<p>AI Research Center intro</p>',
      websiteURL: RESEARCH_SEED.center.website,
      mainImageUrl: null,
    },
  });

  const professors: LangPair[] = [];
  for (const p of RESEARCH_SEED.professors) {
    professors.push(
      await postMultipart<LangPair>(cookie, '/api/v2/professor', {
        ko: professorBody(p.ko, true),
        en: professorBody(p.en, false),
      }),
    );
  }

  for (let i = 0; i < RESEARCH_SEED.labs.length; i++) {
    const lab = RESEARCH_SEED.labs[i];
    const prof = professors[i];
    await postMultipart(cookie, '/api/v2/research/lab', {
      ko: {
        name: lab.ko,
        description: `<p>${lab.ko} 설명</p>`,
        groupId: group.ko.id,
        professorIds: [prof.ko.id],
        location: lab.location.ko,
        tel: lab.tel,
        acronym: lab.acronym,
        youtube: null,
        websiteURL: 'https://example.com',
      },
      en: {
        name: lab.en,
        description: `<p>${lab.en} description</p>`,
        groupId: group.en.id,
        professorIds: [prof.en.id],
        location: lab.location.en,
        tel: lab.tel,
        acronym: lab.acronym,
        youtube: null,
        websiteURL: 'https://example.com',
      },
    });
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
