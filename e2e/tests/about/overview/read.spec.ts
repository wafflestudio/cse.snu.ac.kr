import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { ABOUT_SEED } from '../../setup/seed/about';

/** 읽기(비로그인·비변경). 학부 소개(편집-only 콘텐츠 싱글톤). */
test.describe('학부 소개 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/about/overview');
    expect(res?.status()).toBe(200);
    await expect(page.getByText(ABOUT_SEED.overview.ko)).toBeVisible();
    // overview 시드 본문엔 인라인 font-size 마커가 들어 있다(seed-content.sh). strict CSP가
    // 백엔드 HTML의 인라인 스타일을 떼면 글자 크기가 줄어 이 스크린샷이 깨진다 → CSP 회귀를 비주얼로 가드.
    await expect(page).toHaveScreenshot('overview-ko.png', { fullPage: true });
  });
});
