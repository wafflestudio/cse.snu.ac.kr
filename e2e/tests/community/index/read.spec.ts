import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';

/** 읽기(비로그인·비변경). /community 인덱스: 정적 CategoryPage. */
test.describe('소식 인덱스 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/community');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('Connect with CSE')).toBeVisible();
    await expect(page.getByText('공지사항').first()).toBeVisible();
    await expect(page).toHaveScreenshot('community-index-ko.png', {
      fullPage: true,
    });
  });
});
