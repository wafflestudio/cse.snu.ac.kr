import { expect, type Page, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import { setLocale } from '../../helpers/locale';

async function createNotice(
  page: Page,
  title: string,
  body: string,
  tags: string[],
) {
  const response = await page.request.post('/api/v2/notice', {
    multipart: {
      request: {
        name: 'request.json',
        mimeType: 'application/json',
        buffer: Buffer.from(
          JSON.stringify({
            title,
            titleForMain: null,
            description: `<p>${body}</p>`,
            isPrivate: false,
            isPinned: false,
            pinnedUntil: null,
            isImportant: false,
            importantUntil: null,
            tags,
          }),
        ),
      },
    },
  });
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { id: number }).id;
}

async function deleteNotices(page: Page, ids: number[]) {
  const response = await page.request.delete('/api/v2/notice', {
    data: { idList: ids },
  });
  expect(response.ok()).toBe(true);
}

/**
 * 행정실 요청 두 가지(2026-10).
 * - 채용 공지 분리: '채용정보' 태그 공지는 공지사항 목록·검색에서 빠지고 /community/jobs 에만 모인다.
 * - 공지 검색: 제목에 글자 그대로 든 낱말로 찾고(부분 글자도), 검색어를 굵게 보인다. 본문만 맞으면 안 나온다.
 * baseline 을 건드리지 않도록 고유 제목(Date.now())으로 만들고 끝에 지운다.
 */
test.describe('공지 - 채용정보 분리와 제목 검색', () => {
  test('채용 공지는 채용정보에만 모이고 공지사항 목록·검색에서는 빠진다', async ({
    page,
  }) => {
    const stamp = Date.now();
    const jobTitle = `채용표본 ${stamp} 신입 개발자`;
    const noticeTitle = `학사표본 ${stamp} 수강 안내`;

    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);
    const ids = [
      await createNotice(page, jobTitle, '채용 본문', ['채용정보']),
      await createNotice(page, noticeTitle, '학사 본문', ['학부']),
    ];

    try {
      await page.goto('/community/jobs');
      await expect(page.getByRole('link', { name: jobTitle })).toBeVisible();
      await expect(page.getByRole('link', { name: noticeTitle })).toHaveCount(
        0,
      );

      await page.goto(`/community/notice?keyword=${stamp}`);
      await expect(page.getByRole('link', { name: noticeTitle })).toBeVisible();
      await expect(page.getByRole('link', { name: jobTitle })).toHaveCount(0);

      await page.goto(`/community/jobs?keyword=${stamp}`);
      await expect(page.getByRole('link', { name: jobTitle })).toBeVisible();

      // 옛 '공지사항 + 채용정보 태그' 주소는 채용정보 페이지로 보낸다.
      await page.goto(
        `/community/notice?tag=${encodeURIComponent('["채용정보"]')}`,
      );
      await page.waitForURL(/\/community\/jobs/);
    } finally {
      await deleteNotices(page, ids);
    }
  });

  test('공지 검색은 제목의 부분 글자로 찾고 검색어를 굵게, 본문만 맞으면 안 나온다', async ({
    page,
  }) => {
    const stamp = Date.now();
    const title = `제목검색표본${stamp} 안내`;

    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);
    const ids = [
      await createNotice(page, title, `본문전용낱말${stamp}`, ['학부']),
    ];

    try {
      // '검색표본' 은 제목 낱말의 가운데 조각이다(검색 색인은 낱말 단위라 못 찾던 경우).
      await page.goto(
        `/community/notice?keyword=${encodeURIComponent(`검색표본${stamp}`)}`,
      );
      const row = page.getByRole('link', { name: title });
      await expect(row).toBeVisible();
      await expect(row.locator('strong')).toHaveText(`검색표본${stamp}`);

      await page.goto(
        `/community/notice?keyword=${encodeURIComponent(`본문전용낱말${stamp}`)}`,
      );
      await expect(
        page.getByText('검색 결과가 존재하지 않습니다.'),
      ).toBeVisible();
    } finally {
      await deleteNotices(page, ids);
    }
  });
});
