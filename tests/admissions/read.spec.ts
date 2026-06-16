import { expect, test } from '@playwright/test';
import { setLocale } from '../helpers/locale';
import { ADMISSIONS_SEED } from '../setup/seed/admissions';

/**
 * 읽기(비로그인·비변경): admissions 동적 라우트(:mainType/:postType).
 * 7개 조합 모두 콘텐츠 싱글톤(SQL 시드)이라 콘텐츠 계약은 7조합 전부 assert,
 * 비주얼은 레이아웃 대표 2장(기본 + extraBottom)만 — 나머지는 데이터만 다른 반복.
 */
test.describe('입학 - 읽기', () => {
  for (const [combo, text] of Object.entries(ADMISSIONS_SEED)) {
    test(`${combo} 렌더된다 (ko)`, async ({ page }) => {
      await setLocale(page, 'ko');
      const res = await page.goto(`/admissions/${combo}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByText(text.ko)).toBeVisible();
    });
  }

  test('학부 정시 모집 비주얼 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/admissions/undergraduate/regular-admission');
    await expect(
      page.getByText(ADMISSIONS_SEED['undergraduate/regular-admission'].ko),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('admissions-undergraduate-regular-ko.png', {
      fullPage: true,
    });
  });

  test('외국인 장학 비주얼 (ko, extraBottom)', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/admissions/international/scholarships');
    await expect(
      page.getByText(ADMISSIONS_SEED['international/scholarships'].ko),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('admissions-international-scholarships-ko.png', {
      fullPage: true,
    });
  });
});
