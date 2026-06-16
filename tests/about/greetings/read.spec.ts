import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { ABOUT_SEED } from '../../setup/seed/about';

/** 읽기(비로그인·비변경). 학부장 인사말(편집-only 콘텐츠 싱글톤). */
test.describe('학부장 인사말 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/about/greetings');
    expect(res?.status()).toBe(200);
    await expect(page.getByText(ABOUT_SEED.greetings.ko)).toBeVisible();
    await expect(page).toHaveScreenshot('greetings-ko.png', { fullPage: true });
  });
});
