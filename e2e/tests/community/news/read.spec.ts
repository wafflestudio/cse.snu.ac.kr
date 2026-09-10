import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { NEWS_SEED } from '../../setup/seed/community';

/**
 * 읽기(비로그인·비변경): 새 소식 목록·상세.
 * 표시 날짜가 payload date(고정값)라 마스킹 없이 결정론적.
 */
test.describe('새 소식 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/community/news');
    expect(res?.status()).toBe(200);
    // 목록 렌더 앵커 1개(나머지·픽셀은 스크린샷이 커버)
    await expect(
      page.getByRole('heading', { name: NEWS_SEED[0].title }),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('news-list-ko.png', { fullPage: true });
  });

  test('상세 (ko)', async ({ page }) => {
    const news = NEWS_SEED[0];
    await setLocale(page, 'ko');
    await page.goto('/community/news');
    await page.getByRole('heading', { name: news.title }).click();
    await page.waitForURL(/\/community\/news\/\d+/);

    await expect(page.getByRole('heading', { name: news.title })).toBeVisible();
    await expect(page.getByText(news.descriptionText)).toBeVisible();
    await expect(page).toHaveScreenshot('news-detail-ko.png', {
      fullPage: true,
    });
  });
});
