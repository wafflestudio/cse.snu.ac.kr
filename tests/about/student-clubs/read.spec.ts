import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { CLUBS_SEED } from '../../setup/seed/about';

/** 읽기(비로그인·비변경). 학생 동아리(SelectionList, 기본 선택=첫 항목). */
test.describe('학생 동아리 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/about/student-clubs');
    expect(res?.status()).toBe(200);
    // 목록 렌더 앵커 1개(나머지·픽셀은 스크린샷이 커버). 선택 항목은 목록+상세 중복 노출 → first()
    await expect(page.getByText(CLUBS_SEED[0].ko).first()).toBeVisible();
    await expect(page).toHaveScreenshot('student-clubs-ko.png', {
      fullPage: true,
    });
  });
});
