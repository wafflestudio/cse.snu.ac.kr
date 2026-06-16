import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { ACADEMICS_SEED } from '../../setup/seed/academics';

/** 읽기(비로그인·비변경). 졸업 규정(콘텐츠 싱글톤, SQL 시드, 학부 전용). */
test.describe('졸업 규정 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/academics/undergraduate/degree-requirements');
    expect(res?.status()).toBe(200);
    await expect(
      page.getByText(ACADEMICS_SEED.degreeRequirements.ko),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('degree-requirements-ko.png', {
      fullPage: true,
    });
  });
});
