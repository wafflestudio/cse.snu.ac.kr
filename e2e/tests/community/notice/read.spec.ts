import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { NOTICE_SEED } from '../../setup/seed/community';

/**
 * 읽기(비로그인·비변경): 공지사항 목록·상세.
 * createdAt은 globalSetup의 normalize-dates.sh가 고정값으로 정규화하므로 마스킹 없이 결정론적.
 * 조회수만 열 때마다 늘어 정규화가 불가능해 마스킹한다(시드가 네 자리라 폭은 고정).
 */
test.describe('공지사항 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/community/notice');
    expect(res?.status()).toBe(200);
    // 목록 렌더 앵커 1개(나머지·픽셀은 스크린샷이 커버)
    await expect(
      page.getByRole('link', { name: NOTICE_SEED[0].title }),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('notice-list-ko.png', {
      fullPage: true,
      mask: [page.getByTestId('view-count')],
    });
  });

  test('상세 (ko)', async ({ page }) => {
    const notice = NOTICE_SEED[0];
    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await page.getByRole('link', { name: notice.title }).click();
    await page.waitForURL(/\/community\/notice\/\d+/);

    await expect(
      page.getByRole('heading', { name: notice.title }),
    ).toBeVisible();
    await expect(page.getByText(notice.descriptionText)).toBeVisible();
    await expect(page).toHaveScreenshot('notice-detail-ko.png', {
      fullPage: true,
      mask: [page.getByTestId('view-count')],
    });
  });
});
