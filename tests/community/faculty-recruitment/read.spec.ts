import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { RECRUIT_SEED } from '../../setup/seed/community';

/** 읽기(비로그인·비변경). 신임교수초빙(편집-only 싱글톤, 다국어 분리 없음). */
test.describe('신임교수초빙 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/community/faculty-recruitment');
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { name: RECRUIT_SEED.title }),
    ).toBeVisible();
    await expect(page.getByText(RECRUIT_SEED.descriptionText)).toBeVisible();
    await expect(page).toHaveScreenshot('recruit-ko.png', { fullPage: true });
  });
});
