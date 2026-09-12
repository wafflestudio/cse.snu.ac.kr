import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';

/** 읽기(비로그인·비변경). 개인정보처리방침(정적 하드코딩). */
test.describe('개인정보처리방침 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/reservations/privacy-policy');
    expect(res?.status()).toBe(200);
    await expect(
      page.getByText('개인정보 수집', { exact: false }).first(),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('reservations-privacy-policy-ko.png', {
      fullPage: true,
    });
  });
});
