import { NEWS_TAGS, NOTICE_TAGS } from '../../../app/constants/tag';
import { postJson, postMultipart } from './client';

/**
 * community 도메인 baseline. 우선 notice(공지사항)부터.
 *
 * 공지는 다국어 분리가 아니라 단일 레코드(백엔드 searchNotice에 language 파라미터 없음)라
 * ko/en 목록 모두 같은 글을 보여준다. createdAt은 서버가 생성 시각으로 박으므로
 * 비주얼 스펙에서 날짜는 마스킹한다(데이터로 고정 불가).
 *
 * NOTICE_SEED: notice read 스펙의 기대값 단일 출처.
 * 원소 형태는 균일하게 유지(isPinned/isImportant 모두 명시) → 시더 루프에서 캐스트 불필요.
 */
export const NOTICE_SEED = [
  {
    title: '학사 일정 안내',
    description: '<p>학사 일정 본문입니다.</p>',
    descriptionText: '학사 일정 본문입니다.',
    tags: ['학사(학부)'],
    isPinned: false,
    // 메인 중요안내 섹션용. isImportant는 목록/상세에 아이콘이 없어 community 비주얼엔 영향 없음.
    isImportant: true,
  },
  {
    title: '장학금 신청 공지',
    description: '<p>장학금 신청 본문입니다.</p>',
    descriptionText: '장학금 신청 본문입니다.',
    tags: ['장학'],
    isPinned: true,
    isImportant: false,
  },
] as const;

/**
 * 새 소식(news). notice와 달리 표시 날짜가 createdAt이 아니라 payload의 `date`라
 * 시드값으로 고정 가능 → normalize-dates 불필요. date 내림차순으로 목록 정렬된다.
 */
export const NEWS_SEED = [
  {
    title: '연구실 수상 소식',
    description: '<p>수상 본문입니다.</p>',
    descriptionText: '수상 본문입니다.',
    date: '2024-02-10',
    tags: ['수상'],
    // 메인 슬라이드(NewsSection)용. 1개라 carousel pageCnt=1 → 자동스크롤 정지(결정론). 목록 아이콘 없음.
    isSlide: true,
  },
  {
    title: '학부 행사 안내',
    description: '<p>행사 본문입니다.</p>',
    descriptionText: '행사 본문입니다.',
    date: '2024-02-05',
    tags: ['행사'],
    isSlide: false,
  },
] as const;

/**
 * 세미나(seminar). 태그 없음. 표시 날짜가 payload의 startDate(고정값)라 normalize 불필요.
 * SeminarDto는 description/introduction/name/affiliation/location이 non-null이라 모두 채운다.
 * 목록은 startDate 내림차순 + 연도별 그룹 헤더.
 */
export const SEMINAR_SEED = [
  {
    title: '인공지능 특별 세미나',
    name: '김연사',
    affiliation: '서울대학교',
    location: '301동 세미나실',
    startDate: '2024-02-10T14:00:00',
    descriptionText: '세미나 요약입니다.',
  },
  {
    title: '머신러닝 세미나',
    name: '이연사',
    affiliation: 'KAIST',
    location: '302동 세미나실',
    startDate: '2024-02-05T14:00:00',
    descriptionText: '세미나 요약입니다.',
  },
] as const;

/**
 * 신임교수초빙(recruit). PUT 업서트 싱글톤(0행이면 생성) → API로 시드 가능(SQL 불필요).
 * GET은 다국어 분리 없음. 편집-only.
 */
export const RECRUIT_SEED = {
  title: '2024 신임교수 초빙',
  description: '<p>신임교수 초빙 공고입니다.</p>',
  descriptionText: '신임교수 초빙 공고입니다.',
} as const;

export async function seedCommunity(cookie: string) {
  // 공지/새소식 태그 참조 테이블(tag_in_notice/news)은 Flyway가 아니라 enrollTag API로
  // 채워지는데 reset-db가 truncate하므로, baseline이 매 런 다시 등록한다
  // (없으면 태그 단 글 생성이 500).
  for (const tag of NOTICE_TAGS) {
    await postJson(cookie, '/api/v2/notice/tag', { name: tag });
  }
  for (const tag of NEWS_TAGS) {
    await postJson(cookie, '/api/v2/news/tag', { name: tag });
  }

  for (const n of NOTICE_SEED) {
    await postMultipart(cookie, '/api/v2/notice', {
      title: n.title,
      titleForMain: null,
      description: n.description,
      isPrivate: false,
      isPinned: n.isPinned,
      pinnedUntil: null,
      isImportant: n.isImportant,
      importantUntil: null,
      tags: n.tags,
    });
  }

  for (const n of NEWS_SEED) {
    await postMultipart(cookie, '/api/v2/news', {
      title: n.title,
      titleForMain: null,
      description: n.description,
      date: `${n.date}T00:00:00`,
      isPrivate: false,
      isImportant: false,
      importantUntil: null,
      isSlide: n.isSlide,
      tags: n.tags,
    });
  }

  for (const s of SEMINAR_SEED) {
    await postMultipart(cookie, '/api/v2/seminar', {
      title: s.title,
      titleForMain: null,
      description: `<p>${s.descriptionText}</p>`,
      location: s.location,
      startDate: s.startDate,
      endDate: null,
      host: '컴퓨터공학부',
      name: s.name,
      speakerURL: null,
      speakerTitle: '교수',
      affiliation: s.affiliation,
      affiliationURL: null,
      introduction: '<p>연사 소개입니다.</p>',
      isPrivate: false,
      isImportant: false,
    });
  }

  await postMultipart(
    cookie,
    '/api/v2/recruit',
    {
      title: RECRUIT_SEED.title,
      description: RECRUIT_SEED.description,
      removeImage: false,
    },
    'PUT',
  );
}
