import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { FUTURE_CAREERS_SEED } from '../../setup/seed/about';

/**
 * 읽기(비로그인·비변경): 졸업생 진로(단일 페이지, 상세 없음).
 * baseline = description 싱글톤 + stat 연도(dropdown 기본값) + 창업 기업.
 */
test.describe('졸업생 진로 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/about/future-careers');
    expect(res?.status()).toBe(200);

    await expect(
      page.getByText(FUTURE_CAREERS_SEED.description.ko),
    ).toBeVisible();
    // stat: 시드한 연도가 dropdown 기본값(maxYear)으로 선택되어 표시
    // (Dropdown은 Radix Select → 트리거 role=combobox, 선택 연도는 트리거 텍스트로 노출)
    await expect(page.getByRole('combobox')).toContainText(
      String(FUTURE_CAREERS_SEED.statYear),
    );
    // companies: 창업 기업명 앵커 1개(나머지·픽셀은 스크린샷이 커버)
    await expect(
      page.getByText(FUTURE_CAREERS_SEED.companies[0].name),
    ).toBeVisible();

    await expect(page).toHaveScreenshot('future-careers-ko.png', {
      fullPage: true,
    });
  });
});
