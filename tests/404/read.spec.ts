import { expect, test } from '@playwright/test';
import { setLocale } from '../helpers/locale';

/** 읽기(비로그인·비변경). 404 catch-all(`*`), 정적. */
test.describe('404 - 읽기', () => {
  test('존재하지 않는 경로는 404를 렌더한다 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const response = await page.goto('/this-path-does-not-exist-xyz');

    // 화면만이 아니라 HTTP 상태도 404여야 한다. 렌더 단언만 있던 탓에 "본문은 404인데
    // 상태는 200"인 상태가 오래 통과했다(soft 404 → 크롤러 색인, 취약점 점검 오탐).
    // 상세 근거는 tests/security.spec.ts.
    expect(response?.status()).toBe(404);

    await expect(page.getByText('존재하지 않는 경로입니다')).toBeVisible();
    await expect(page).toHaveScreenshot('404-ko.png', { fullPage: true });
  });
});
