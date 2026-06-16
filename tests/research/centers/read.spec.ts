import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { RESEARCH_SEED } from '../../setup/seed/research';

/** 읽기(비로그인·비변경). 연구 센터(상세는 인덱스 인라인 SelectionList). */
test.describe('연구 센터 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/research/centers');
    expect(res?.status()).toBe(200);
    await expect(page.getByText(RESEARCH_SEED.center.ko).first()).toBeVisible();
    await expect(page).toHaveScreenshot('centers-ko.png', { fullPage: true });
  });
});
