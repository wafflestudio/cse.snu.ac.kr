import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { ACADEMICS_SEED } from '../../setup/seed/academics';

/**
 * 읽기(비로그인·비변경): 학부/대학원 안내(guide). 콘텐츠 싱글톤(SQL 시드).
 * 프론트가 language를 안 보내 백엔드가 항상 ko 반환 → en 페이지도 ko 본문.
 */
test.describe('학사 안내(guide) - 읽기', () => {
  test('학부 안내 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/academics/undergraduate/guide');
    expect(res?.status()).toBe(200);
    await expect(
      page.getByText(ACADEMICS_SEED.guide.undergraduate.ko),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('guide-undergraduate-ko.png', {
      fullPage: true,
    });
  });

  test('대학원 안내 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/academics/graduate/guide');
    expect(res?.status()).toBe(200);
    await expect(
      page.getByText(ACADEMICS_SEED.guide.graduate.ko),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('guide-graduate-ko.png', {
      fullPage: true,
    });
  });
});
