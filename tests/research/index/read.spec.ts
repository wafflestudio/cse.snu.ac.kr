import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';

/** 읽기(비로그인·비변경). /research 인덱스: 정적 CategoryPage. */
test.describe('연구·교육 인덱스 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/research');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('Research & Education at CSE')).toBeVisible();
    await expect(page.getByText('연구실 목록').first()).toBeVisible();
    await expect(page).toHaveScreenshot('research-index-ko.png', {
      fullPage: true,
    });
  });
});
