import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, type Page, test } from '@playwright/test';
import { loginAsStaff } from '../tests/helpers/auth';
import {
  fillHTMLEditor,
  fillTextInput,
  submitForm,
  switchEditorLanguage,
} from '../tests/helpers/forms';
import { setLocale } from '../tests/helpers/locale';
import { normalizeDates } from '../tests/setup/db';
import { mockLoginCookie, postMultipart } from '../tests/setup/seed/client';

const output = fileURLToPath(
  new URL('../../docs/design-system/baseline/', import.meta.url),
);
const reservation =
  '/reservations/seminar-room/301-417?selectedDate=2024-03-15';

async function open(
  page: Page,
  path: string,
  width: number,
  locale: 'ko' | 'en' = 'ko',
) {
  await page.setViewportSize({ width, height: 844 });
  await setLocale(page, locale);
  const response = await page.goto(locale === 'en' ? `/en${path}` : path);
  expect(response?.status()).toBe(200);
  await expect(page.locator('header').first()).toBeVisible();
}

async function capture(page: Page, name: string, note: string) {
  await mkdir(output, { recursive: true });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const img of document.images) img.loading = 'eager';
    await Promise.all(
      Array.from(document.images, (img) => img.decode().catch(() => undefined)),
    );
  });
  await page.mouse.move(300, 8);
  // 회귀 테스트와 같은 조회수/메인 뉴스 이미지 마스크. 나머지는 실제 로컬 렌더.
  await page.screenshot({
    path: `${output}${name}.png`,
    fullPage: true,
    animations: 'disabled',
    mask: [
      page.getByTestId('view-count'),
      page.locator('a[href*="/community/news/"] .object-cover'),
    ],
  });
  const measurements = await page.evaluate(() => ({
    title: document.title,
    viewport: {
      width: innerWidth,
      height: innerHeight,
      deviceScaleFactor: devicePixelRatio,
    },
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    headings: Array.from(document.querySelectorAll('h1,h2,h3'))
      .filter((el) => el.getClientRects().length)
      .map((el) => el.textContent),
    visibleDates: Array.from(document.querySelectorAll('time[datetime]'))
      .filter((el) => el.getClientRects().length)
      .map((el) => el.getAttribute('datetime')),
  }));
  await writeFile(
    `${output}${name}.json`,
    `${JSON.stringify(
      {
        url: new URL(page.url()).pathname + new URL(page.url()).search,
        note,
        ...measurements,
      },
      null,
      2,
    )}\n`,
  );
}

test('영문·중간 폭의 대표 화면', async ({ page }) => {
  const cases: [string, string, number][] = [
    ['main-en-1280', '/', 1280],
    ['main-en-390', '/', 390],
    ['category-en-390', '/academics', 390],
    ['category-en-768', '/academics', 768],
    ['category-en-1920', '/academics', 1920],
    ['prose-en-390', '/about/greetings', 390],
    ['selection-en-390', '/research/groups', 390],
    ['selection-en-1024', '/research/groups', 1024],
    ['people-en-390', '/people/faculty', 390],
    ['people-en-1024', '/people/faculty', 1024],
    ['courses-en-390', '/academics/undergraduate/courses', 390],
    ['courses-en-768', '/academics/undergraduate/courses', 768],
    ['timeline-en-390', '/academics/undergraduate/curriculum', 390],
    ['careers-en-768', '/about/future-careers', 768],
    ['conference-en-360', '/research/top-conference-list', 360],
    ['search-empty-en-390', '/search?keyword=design-survey-no-result', 390],
  ];
  for (const [name, path, width] of cases) {
    await open(page, path, width, 'en');
    await capture(page, name, '기존 E2E 시드 / 공개 화면 / 영어');
  }
});

test('반응형 전환과 공개 상호작용', async ({ page }) => {
  for (const width of [639, 640, 1023, 1024]) {
    await open(page, reservation, width);
    await capture(
      page,
      `reservation-ko-${width}`,
      '고정 날짜 / 다음 날짜 클릭 전',
    );
    await page.getByRole('button', { name: '다음 날짜' }).click();
    await page.waitForURL(/selectedDate=2024-03-(18|22)/);
    await capture(
      page,
      `reservation-next-ko-${width}`,
      '실제 다음 날짜 버튼 클릭 후 / URL과 보이는 날짜를 함께 기록',
    );
  }
  await open(page, '/about', 390);
  await page.getByRole('button', { name: '메뉴 열기' }).click();
  await expect(page.getByRole('button', { name: '메뉴 닫기' })).toBeVisible();
  await capture(page, 'navigation-open-ko-390', '모바일 메뉴 열림');
  await open(page, '/academics/undergraduate/courses', 390);
  await page
    .getByRole('button', { name: '컴퓨터의 개념 및 실습', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await capture(page, 'course-dialog-ko-390', '교과목 목록에서 상세 모달 열림');
  await open(page, '/academics/undergraduate/courses?view=카드형', 1280);
  await capture(page, 'courses-card-ko-1280', '기존 교과목 시드 / 카드형');
});

test('관리·편집 기본과 입력 상태', async ({ page }) => {
  await open(page, '/community/notice', 1280);
  await loginAsStaff(page);
  await page.clock.setFixedTime(new Date('2026-09-22T03:00:00Z'));
  for (const width of [1280, 390]) {
    await open(page, '/community/notice/create', width);
    await expect(page.locator('.sun-editor-editable')).toHaveAttribute(
      'contenteditable',
      'true',
    );
    await capture(page, `notice-editor-ko-${width}`, 'STAFF / 빈 공지 편집기');
    await submitForm(page, '게시하기');
    await expect(page.getByText('제목을 입력해주세요.')).toBeVisible();
    await capture(
      page,
      `notice-errors-ko-${width}`,
      '빈 폼 제출 / 필수 검증 오류 / DB 저장 없음',
    );
    await open(page, '/community/notice/create', width);
    await fillTextInput(
      page,
      'title',
      '디자인 조사용 긴 제목 — 학부와 대학원 구성원을 위한 학사 일정 및 연구 프로그램 신청 방법 안내',
    );
    await fillHTMLEditor(
      page,
      '조사용 미저장 본문입니다. 긴 제목, 첨부, 게시 설정이 함께 놓인 상태를 확인합니다.',
    );
    await page
      .getByText('파일 선택', { exact: true })
      .locator('input[type="file"]')
      .setInputFiles({
        name: '디자인-조사용-긴-첨부파일-이름.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Local design survey fixture'),
      });
    await expect(
      page.getByText('디자인-조사용-긴-첨부파일-이름.txt', { exact: true }),
    ).toBeVisible();
    await page.getByText('목록 상단에 고정', { exact: true }).click();
    await page.getByText('만료일 설정', { exact: true }).click();
    await capture(
      page,
      `notice-filled-ko-${width}`,
      '긴 제목·첨부·고정 만료일 / 미저장 / 브라우저 날짜 2026-09-22 KST',
    );
  }
  await open(page, '/people/faculty/create', 390);
  await switchEditorLanguage(page, 'en');
  await fillTextInput(
    page,
    'en.name',
    'Alexandra Computational Systems Researcher',
  );
  await capture(page, 'faculty-editor-en-390', 'STAFF / 영어 입력 탭 / 미저장');
  for (const [selected, label] of [
    ['slide', '슬라이드쇼 관리'],
    ['important', '중요 안내 관리'],
    ['imageModal', '이미지 팝업 관리'],
  ]) {
    await open(page, `/admin?selected=${selected}`, 1280);
    await expect(page.getByText(label).first()).toBeVisible();
    await capture(page, `admin-${selected}-ko-1280`, `STAFF / ${label}`);
  }
  await open(page, reservation, 390);
  await page.getByRole('button', { name: '예약하기', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await capture(
    page,
    'reservation-add-ko-390',
    'STAFF / 예약 추가 모달 / 미저장',
  );
});

test('긴 본문과 표·목록·링크', async ({ page }) => {
  const cookie = await mockLoginCookie();
  const title =
    '디자인 조사용 긴 제목 — Undergraduate and Graduate Research Programme Application Guidelines and Academic Calendar';
  const description =
    '<h2>조사 전용 콘텐츠 / Survey fixture</h2>' +
    '<p>이 글은 디자인 조사용 로컬 표본이며 실제 공지가 아닙니다. 문단의 길이가 달라질 때 줄바꿈과 읽기 흐름을 확인합니다. Research projects require clear application instructions, accessible information, and consistent navigation across different screen sizes.</p>'.repeat(
      6,
    ) +
    '<h3>신청 단계</h3><ul><li>지원 자격 및 제출 서류 확인</li><li>신청서 작성 및 첨부 제출</li><li>접수 결과 확인</li></ul>' +
    '<table><thead><tr><th>프로그램</th><th>대상</th><th>접수 기간</th></tr></thead><tbody><tr><td>Undergraduate Research Programme</td><td>학부생 및 대학원생</td><td>2026-09-01 – 2026-09-30</td></tr></tbody></table>' +
    '<p><a href="https://example.com/research-programme/application-guidelines">Application guidelines and supporting documents</a></p>';
  const created = await postMultipart<{ id: number }>(
    cookie,
    '/api/v2/notice',
    {
      title,
      titleForMain: null,
      description,
      isPrivate: false,
      isPinned: false,
      pinnedUntil: null,
      isImportant: false,
      importantUntil: null,
      tags: ['학부', '대학원'],
    },
  );
  try {
    await normalizeDates();
    for (const width of [360, 768, 1280]) {
      await open(page, `/community/notice/${created.id}`, width);
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
      await capture(
        page,
        `long-notice-ko-${width}`,
        '조사 전용 로컬 API 생성 데이터 / 긴 한영 제목·6문단·목록·표·링크 / 실제 HTMLViewer',
      );
    }
  } finally {
    const response = await fetch(
      `${process.env.E2E_API_URL ?? 'http://localhost:8080'}/api/v2/notice/${created.id}`,
      { method: 'DELETE', headers: { cookie } },
    );
    expect(response.ok).toBeTruthy();
  }
});
