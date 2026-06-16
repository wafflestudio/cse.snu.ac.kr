import { postJson, postMultipart } from './client';

/**
 * academics 콘텐츠 싱글톤(guide/degree-requirements)의 기대값.
 *
 * 이 콘텐츠는 PUT만 있고 생성 API가 없어(빈 DB면 404) `tests/setup/seed-content.sh`가
 * SQL로 직접 시드한다. 아래 텍스트는 seed-content.sh의 seed_academics 인자와 일치해야 한다.
 *
 * 주의: 프론트 loader가 language 쿼리를 보내지 않아 백엔드가 항상 ko를 반환(@RequestParam
 * defaultValue="ko") → ko/en 페이지 모두 ko 본문을 렌더한다. read 스펙은 ko 텍스트를 기대값으로 쓴다.
 */
export const ACADEMICS_SEED = {
  guide: {
    undergraduate: { ko: '학부 안내 본문입니다.', en: 'Undergraduate guide.' },
    graduate: { ko: '대학원 안내 본문입니다.', en: 'Graduate guide.' },
  },
  degreeRequirements: { ko: '졸업 규정 본문입니다.', en: 'Degree requirements.' },
  // 장학: 페이지 description은 SQL 싱글톤, 장학금 목록은 API(createScholarship)로 시드.
  scholarshipPage: { ko: '장학 제도 안내입니다.', en: 'Scholarships intro.' },
  scholarships: [
    {
      koName: '성적우수 장학금',
      enName: 'Merit Scholarship',
      koDescription: '<p>성적 우수자 대상 장학금입니다.</p>',
      enDescription: '<p>For top-performing students.</p>',
      koDescriptionText: '성적 우수자 대상 장학금입니다.',
    },
  ],
  // 연도별 타임라인(year). API 시드(POST). 프론트가 language 미전달 → ko로 생성/조회.
  curriculum: { year: 2024, descriptionText: '2024 전공 이수 안내입니다.' },
  generalStudies: { year: 2024, descriptionText: '2024 교양 이수 안내입니다.' },
  courseChanges: { year: 2024, descriptionText: '2024 교과목 변경 안내입니다.' },
  // 교과목(courses). createCourse JSON API. CourseCard가 name/code를 렌더.
  course: {
    code: 'M1522.000600',
    credit: 3,
    grade: 1,
    ko: { name: '컴퓨터의 개념 및 실습', classification: '전공필수' },
    en: { name: 'Computer Concepts and Practice', classification: 'Major Required' },
  },
} as const;

/** 학부 장학금 목록을 API로 시드(페이지 description 싱글톤은 seed-content.sh가 SQL). */
export async function seedAcademics(cookie: string) {
  for (const s of ACADEMICS_SEED.scholarships) {
    await postJson(cookie, '/api/v2/academics/undergraduate/scholarship', {
      koName: s.koName,
      koDescription: s.koDescription,
      enName: s.enName,
      enDescription: s.enDescription,
    });
  }

  // 연도별 타임라인(multipart `request`={year, description, name}).
  const years: [string, { year: number; descriptionText: string }][] = [
    ['curriculum', ACADEMICS_SEED.curriculum],
    ['general-studies-requirements', ACADEMICS_SEED.generalStudies],
    ['course-changes', ACADEMICS_SEED.courseChanges],
  ];
  for (const [path, seed] of years) {
    await postMultipart(cookie, `/api/v2/academics/undergraduate/${path}`, {
      year: seed.year,
      description: `<p>${seed.descriptionText}</p>`,
      name: '',
    });
  }

  // 교과목(JSON @RequestBody GroupedCourseDto)
  const c = ACADEMICS_SEED.course;
  await postJson(cookie, '/api/v2/academics/courses', {
    code: c.code,
    credit: c.credit,
    grade: c.grade,
    studentType: 'undergraduate',
    ko: {
      name: c.ko.name,
      description: '<p>교과목 설명입니다.</p>',
      classification: c.ko.classification,
    },
    en: {
      name: c.en.name,
      description: '<p>Course description.</p>',
      classification: c.en.classification,
    },
  });
}
