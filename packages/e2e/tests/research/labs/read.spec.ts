import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { RESEARCH_SEED } from '../../setup/seed/research';

/**
 * 읽기(비로그인·비변경): 연구실 목록·상세. 콘텐츠 계약 + 비주얼 회귀를 한 파일에서.
 * 로컬 docker 백엔드에 globalSetup이 심은 결정론적 baseline이 화면까지 도달하는지 확인.
 */
test.describe('연구실 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/research/labs');
    expect(res?.status()).toBe(200);
    // 목록 렌더 앵커 1개(나머지 항목·픽셀은 스크린샷이 커버)
    await expect(page.getByText(RESEARCH_SEED.labs[0].ko)).toBeVisible();
    await expect(page).toHaveScreenshot('labs-list-ko.png', { fullPage: true });
  });

  test('상세 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/research/labs');
    // 목록에서 연구실 링크를 눌러 상세로 진입(블랙박스, id 하드코딩 회피)
    await page.getByRole('link', { name: RESEARCH_SEED.labs[0].ko }).click();
    await page.waitForURL(/\/research\/labs\/\d+$/);
    await expect(
      page.getByRole('heading', { name: RESEARCH_SEED.labs[0].ko }),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('labs-detail-ko.png', {
      fullPage: true,
    });
  });
});
