import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';

/** 읽기(비로그인·비변경). /people 인덱스: 정적 CategoryPage. */
test.describe('구성원 인덱스 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/people');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('People of CSE')).toBeVisible();
    await expect(page.getByText('교수진').first()).toBeVisible();
    await expect(page).toHaveScreenshot('people-index-ko.png', {
      fullPage: true,
    });
  });
});
