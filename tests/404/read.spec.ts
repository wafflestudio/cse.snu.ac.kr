import { expect, test } from '@playwright/test';
import { setLocale } from '../helpers/locale';

/** 읽기(비로그인·비변경). 404 catch-all(`*`), 정적. */
test.describe('404 - 읽기', () => {
  test('존재하지 않는 경로는 404를 렌더한다 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const response = await page.goto('/this-path-does-not-exist-xyz');

    // 화면과 상태 코드가 같이 맞아야 한다. 렌더 단언만으로는 soft 404(본문은 404, 상태는
    // 200)를 못 잡는다 — 상태 코드 층 전반은 tests/security.spec.ts가 담당한다.
    expect(response?.status()).toBe(404);

    await expect(page.getByText('존재하지 않는 경로입니다')).toBeVisible();
    await expect(page).toHaveScreenshot('404-ko.png', { fullPage: true });
  });
});
