import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { ACADEMICS_SEED } from '../../setup/seed/academics';

/** 읽기(비로그인·비변경). 교과목 변경 내역(연도 타임라인, 학부). */
test.describe('교과목 변경 내역 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/academics/undergraduate/course-changes');
    expect(res?.status()).toBe(200);
    await expect(
      page.getByText(ACADEMICS_SEED.courseChanges.descriptionText),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('course-changes-ko.png', {
      fullPage: true,
    });
  });
});
