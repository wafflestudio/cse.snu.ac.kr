/**
 * staging DB 를 비우고 누가 봐도 가상인 데이터로 채운다.
 *
 * E2E baseline(전 도메인을 덮고 이름이 전부 가상 — 박명예·최행정·김철수…) 위에 "[테스트]" 가 붙은
 * 게시물을 목록·페이지네이션·검색을 시험할 만큼 더한다. 백업은 여기서 하지 않는다 — 호스트에서
 * mysqldump 를 먼저 뜬다(README "staging 초기화").
 *
 * 앱 네트워크 안에서 돌아야 한다(db·api 에 직접 닿는다). 실행 방법은 README.
 */
import { NEWS_TAGS } from '@web/routes/$locale/community/news/-constants';
import { NOTICE_TAGS } from '@web/routes/$locale/community/notice/-constants';
import { resetDb, seedContent, withDb } from './tests/setup/db';
import { seedBaseline } from './tests/setup/seed';
import {
  mockLoginCookie,
  postMultipart,
  reindexSearch,
} from './tests/setup/seed/client';

const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8080';
if (/cse\.snu\.ac\.kr/.test(API_URL)) {
  throw new Error('prod 를 가리키고 있다. 이 스크립트는 staging·로컬 전용.');
}

const COUNT = { notice: 60, news: 30, seminar: 20, professor: 8 };

const FAKE_BODY = (kind: string, i: number) =>
  `<p><strong>이 글은 테스트용 가상 데이터입니다.</strong> ${kind} ${i}번 항목이며 실제 안내가 아닙니다.</p>` +
  `<p>본문은 목록·상세·검색 화면을 확인하기 위한 자리표시 문장입니다. 첨부나 링크는 없습니다.</p>` +
  `<ul><li>가상 항목 A</li><li>가상 항목 B</li><li>가상 항목 C</li></ul>`;

const pick = <T>(arr: readonly T[], i: number) => arr[i % arr.length];

async function seedBulk(cookie: string) {
  for (let i = 1; i <= COUNT.notice; i++) {
    await postMultipart(cookie, '/api/v2/notice', {
      title: `[테스트] 공지 ${i} — 가상의 안내문입니다`,
      titleForMain: null,
      description: FAKE_BODY('공지', i),
      isPrivate: i % 12 === 0,
      isPinned: i <= 3,
      pinnedUntil: null,
      isImportant: i % 10 === 5,
      importantUntil: null,
      tags: i % 3 === 0 ? [] : [pick(NOTICE_TAGS, i)],
    });
  }

  for (let i = 1; i <= COUNT.news; i++) {
    const month = String(((i - 1) % 12) + 1).padStart(2, '0');
    await postMultipart(cookie, '/api/v2/news', {
      title: `[테스트] 새소식 ${i} — 가상의 연구 성과 소식`,
      titleForMain: i <= 4 ? `[테스트] 슬라이드 ${i}` : null,
      description: FAKE_BODY('새소식', i),
      date: `2026-${month}-${String((i % 27) + 1).padStart(2, '0')}T00:00:00`,
      isPrivate: false,
      isImportant: i % 9 === 0,
      importantUntil: null,
      isSlide: i <= 4,
      tags: [pick(NEWS_TAGS, i)],
    });
  }

  for (let i = 1; i <= COUNT.seminar; i++) {
    const year = i <= 12 ? 2026 : 2025;
    const month = String(((i - 1) % 12) + 1).padStart(2, '0');
    await postMultipart(cookie, '/api/v2/seminar', {
      title: `[테스트] 세미나 ${i}: 가상 연사의 가상 주제`,
      titleForMain: null,
      description: FAKE_BODY('세미나', i),
      location: `301동 ${100 + i}호 (가상)`,
      startDate: `${year}-${month}-15T14:00:00`,
      endDate: null,
      host: '컴퓨터공학부',
      name: `가상연사${i}`,
      speakerURL: null,
      speakerTitle: '교수',
      affiliation: '가상대학교 가상학과',
      affiliationURL: null,
      introduction: '<p>이 연사는 테스트용 가상 인물입니다.</p>',
      isPrivate: false,
      isImportant: false,
    });
  }

  for (let i = 1; i <= COUNT.professor; i++) {
    await postMultipart(cookie, '/api/v2/professor', {
      status: 'ACTIVE',
      labId: null,
      startDate: null,
      endDate: null,
      phone: `02-880-${String(1000 + i)}`,
      fax: null,
      email: `test.professor${i}@example.com`,
      website: null,
      ko: {
        name: `가상교수${i}`,
        academicRank: '교수',
        department: '컴퓨터공학부',
        office: `301동 ${500 + i}호`,
        educations: ['가상대학교 컴퓨터공학 박사 (테스트)'],
        researchAreas: ['가상 연구 분야 A', '가상 연구 분야 B'],
        careers: ['가상연구소 연구원 (테스트)'],
      },
      en: {
        name: `Test Professor ${i}`,
        academicRank: 'Professor',
        department: 'CSE',
        office: `Bldg 301, Rm ${500 + i}`,
        educations: ['Ph.D. in CS, Fictional University (test)'],
        researchAreas: ['Fictional Area A', 'Fictional Area B'],
        careers: ['Researcher, Fictional Lab (test)'],
      },
    });
  }
}

// 생성 시각을 흩뿌린다. 한 번에 만든 글이 전부 같은 날이면 목록·정렬·연도 헤더를 볼 수 없다.
async function spreadDates() {
  await withDb(async (conn) => {
    for (const table of ['notice', 'news']) {
      await conn.query(
        `UPDATE \`${table}\` SET created_at = DATE_SUB(NOW(), INTERVAL id * 13 HOUR),
         modified_at = created_at`,
      );
    }
  });
}

console.log(`[seed] ${API_URL} — DB 리셋`);
await resetDb();
console.log('[seed] content 싱글톤(SQL)');
await seedContent();
console.log('[seed] E2E baseline(API)');
await seedBaseline();
console.log(
  `[seed] 가상 게시물 — 공지 ${COUNT.notice} · 새소식 ${COUNT.news} · 세미나 ${COUNT.seminar} · 교수 ${COUNT.professor}`,
);
await seedBulk(await mockLoginCookie());
await spreadDates();
console.log('[seed] 검색 색인 재생성');
await reindexSearch();
console.log('[seed] 완료');
