import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { SEMINAR_SEED } from '../../setup/seed/community';

/**
 * 읽기(비로그인·비변경): 세미나 목록·상세.
 * 표시 날짜가 payload startDate(고정값)라 마스킹 없이 결정론적.
 */
test.describe('세미나 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/community/seminar');
    expect(res?.status()).toBe(200);
    // 목록 렌더 앵커 1개(나머지·픽셀은 스크린샷이 커버)
    await expect(
      page.getByRole('heading', { name: SEMINAR_SEED[0].title }),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('seminar-list-ko.png', {
      fullPage: true,
    });
  });

  test('상세 (ko)', async ({ page }) => {
    const seminar = SEMINAR_SEED[0];
    await setLocale(page, 'ko');
    await page.goto('/community/seminar');
    await page.getByRole('heading', { name: seminar.title }).click();
    await page.waitForURL(/\/community\/seminar\/\d+/);

    await expect(
      page.getByRole('heading', { name: seminar.title }),
    ).toBeVisible();
    await expect(page.getByText(seminar.descriptionText)).toBeVisible();
    await expect(page.getByText(seminar.location)).toBeVisible();
    await expect(page).toHaveScreenshot('seminar-detail-ko.png', {
      fullPage: true,
    });
  });
});
