import { expect, test } from '@playwright/test';
import { setLocale } from '../helpers/locale';
import { INTERNAL_SEED } from '../setup/seed/internal';

/** 읽기(비로그인·비변경). 학부 메일링리스트(.internal). PUT 업서트 싱글톤(API 시드), 비로컬라이즈 `_route`(ko만). */
test.describe('학부 메일링리스트 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/.internal');
    expect(res?.status()).toBe(200);
    await expect(page.getByText(INTERNAL_SEED.description)).toBeVisible();
    await expect(page).toHaveScreenshot('internal-ko.png', { fullPage: true });
  });
});
