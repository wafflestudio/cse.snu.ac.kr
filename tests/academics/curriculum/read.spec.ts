import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { ACADEMICS_SEED } from '../../setup/seed/academics';

/** 읽기(비로그인·비변경). 전공 이수 표준 형태(연도 타임라인, 1개 연도 시드). */
test.describe('전공 이수 표준 형태 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/academics/undergraduate/curriculum');
    expect(res?.status()).toBe(200);
    await expect(
      page.getByText(ACADEMICS_SEED.curriculum.descriptionText),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('curriculum-ko.png', {
      fullPage: true,
    });
  });
});
