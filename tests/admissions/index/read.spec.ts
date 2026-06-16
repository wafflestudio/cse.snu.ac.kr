import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';

/** 읽기(비로그인·비변경). /admissions 인덱스: 정적 CategoryPage. */
test.describe('입학 인덱스 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/admissions');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('Join CSE')).toBeVisible();
    await expect(page).toHaveScreenshot('admissions-index-ko.png', {
      fullPage: true,
    });
  });
});
