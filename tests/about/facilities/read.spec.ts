import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { FACILITIES_SEED } from '../../setup/seed/about';

/** 읽기(비로그인·비변경). 시설 안내 목록. */
test.describe('시설 안내 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/about/facilities');
    expect(res?.status()).toBe(200);
    // 목록 렌더 앵커 1개(나머지·픽셀은 스크린샷이 커버)
    await expect(page.getByText(FACILITIES_SEED[0].ko).first()).toBeVisible();
    await expect(page).toHaveScreenshot('facilities-ko.png', {
      fullPage: true,
    });
  });
});
