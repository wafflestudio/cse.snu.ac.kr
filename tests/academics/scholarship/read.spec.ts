import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { ACADEMICS_SEED } from '../../setup/seed/academics';

/**
 * 읽기(비로그인·비변경): 장학 제도. 페이지 description은 SQL 싱글톤, 장학금 목록은 API 시드.
 * 목록은 language 미전달로 ko 이름 반환, 상세는 정상 다국어.
 */
const SCH = ACADEMICS_SEED.scholarships[0];

test.describe('장학 제도 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/academics/undergraduate/scholarship');
    expect(res?.status()).toBe(200);
    await expect(
      page.getByText(ACADEMICS_SEED.scholarshipPage.ko),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: SCH.koName })).toBeVisible();
    await expect(page).toHaveScreenshot('scholarship-list-ko.png', {
      fullPage: true,
    });
  });

  test('상세 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/academics/undergraduate/scholarship');
    await page.getByRole('link', { name: SCH.koName }).click();
    await page.waitForURL(/\/academics\/undergraduate\/scholarship\/\d+/);
    await expect(page.getByRole('heading', { name: SCH.koName })).toBeVisible();
    await expect(page.getByText(SCH.koDescriptionText)).toBeVisible();
    await expect(page).toHaveScreenshot('scholarship-detail-ko.png', {
      fullPage: true,
    });
  });
});
