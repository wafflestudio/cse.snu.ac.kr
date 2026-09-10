import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { STAFF_SEED } from '../../setup/seed/people';

/**
 * 읽기(비로그인·비변경): 행정직원 목록·상세.
 * 상세는 교수진 상세와 다른 레이아웃(PeopleProfileImage+ContactList+InfoList) → 별도 비주얼.
 */
test.describe('행정직원 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/people/staff');
    expect(res?.status()).toBe(200);
    await expect(page.getByText(STAFF_SEED.ko.name).first()).toBeVisible();
    await expect(page).toHaveScreenshot('staff-list-ko.png', {
      fullPage: true,
    });
  });

  test('상세 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/people/staff');
    await page.getByText(STAFF_SEED.ko.name).first().click();
    await page.waitForURL(/\/people\/staff\/\d+/);
    await expect(
      page.getByRole('heading', { name: STAFF_SEED.ko.name }),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('staff-detail-ko.png', {
      fullPage: true,
    });
  });
});
