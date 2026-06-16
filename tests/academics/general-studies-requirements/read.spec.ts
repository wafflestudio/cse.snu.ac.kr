import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { ACADEMICS_SEED } from '../../setup/seed/academics';

/** 읽기(비로그인·비변경). 교양 이수 규정(연도 타임라인). */
test.describe('교양 이수 규정 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto(
      '/academics/undergraduate/general-studies-requirements',
    );
    expect(res?.status()).toBe(200);
    await expect(
      page.getByText(ACADEMICS_SEED.generalStudies.descriptionText),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('general-studies-ko.png', {
      fullPage: true,
    });
  });
});
