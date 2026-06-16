import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { ABOUT_SEED } from '../../setup/seed/about';

/** 읽기(비로그인·비변경). 연락처(편집-only 콘텐츠 싱글톤). */
test.describe('연락처 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/about/contact');
    expect(res?.status()).toBe(200);
    await expect(page.getByText(ABOUT_SEED.contact.ko)).toBeVisible();
    await expect(page).toHaveScreenshot('contact-ko.png', { fullPage: true });
  });
});
