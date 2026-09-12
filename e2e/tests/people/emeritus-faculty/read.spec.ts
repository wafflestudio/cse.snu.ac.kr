import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { EMERITUS_SEED } from '../../setup/seed/people';

/**
 * 읽기(비로그인·비변경): 명예교수(professor status INACTIVE) 목록·상세.
 * 상세는 교수진 상세와 다른 레이아웃(PeopleProfileImage+ContactList+InfoList) → 별도 비주얼.
 * 같은 레이아웃을 staff 상세도 쓰지만 노출 필드가 달라(경력 vs 업무) 각각 캡처한다.
 */
test.describe('명예교수 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/people/emeritus-faculty');
    expect(res?.status()).toBe(200);
    await expect(page.getByText(EMERITUS_SEED.ko).first()).toBeVisible();
    await expect(page).toHaveScreenshot('emeritus-list-ko.png', {
      fullPage: true,
    });
  });

  test('상세 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/people/emeritus-faculty');
    await page.getByText(EMERITUS_SEED.ko).first().click();
    await page.waitForURL(/\/people\/emeritus-faculty\/\d+/);
    await expect(
      page.getByRole('heading', { name: EMERITUS_SEED.ko }),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('emeritus-detail-ko.png', {
      fullPage: true,
    });
  });
});
