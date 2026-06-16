import { expect, test } from '@playwright/test';
import { setLocale } from '../helpers/locale';

/** 읽기(비로그인·비변경). 404 catch-all(`*`), 정적. */
test.describe('404 - 읽기', () => {
  test('존재하지 않는 경로는 404를 렌더한다 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/this-path-does-not-exist-xyz');
    await expect(page.getByText('존재하지 않는 경로입니다')).toBeVisible();
    await expect(page).toHaveScreenshot('404-ko.png', { fullPage: true });
  });
});
