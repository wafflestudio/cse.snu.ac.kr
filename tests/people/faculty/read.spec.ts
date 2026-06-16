import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { RESEARCH_SEED } from '../../setup/seed/research';

/**
 * 읽기(비로그인·비변경): 교수진 목록·상세.
 * 교수는 seed/research.ts가 ACTIVE로 시드(연구실이 참조). 기대값은 RESEARCH_SEED.professors.
 */
test.describe('교수진 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/people/faculty');
    expect(res?.status()).toBe(200);
    // 목록 렌더 앵커 1개(나머지·픽셀은 스크린샷이 커버)
    await expect(
      page.getByText(RESEARCH_SEED.professors[0].ko).first(),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('faculty-list-ko.png', {
      fullPage: true,
    });
  });

  test('상세 (ko)', async ({ page }) => {
    const prof = RESEARCH_SEED.professors[0];
    await setLocale(page, 'ko');
    await page.goto('/people/faculty');
    await page.getByText(prof.ko).first().click();
    await page.waitForURL(/\/people\/faculty\/\d+/);
    await expect(page.getByRole('heading', { name: prof.ko })).toBeVisible();
    await expect(page).toHaveScreenshot('faculty-detail-ko.png', {
      fullPage: true,
    });
  });
});
