import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';

/** 읽기(비로그인·비변경). /reservations 인덱스: 정적 CategoryPage. */
test.describe('예약 인덱스 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/reservations');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('Reserve CSE Facilities')).toBeVisible();
    await expect(page).toHaveScreenshot('reservations-index-ko.png', {
      fullPage: true,
    });
  });
});
