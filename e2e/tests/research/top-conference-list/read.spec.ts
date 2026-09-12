import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { RESEARCH_SEED } from '../../setup/seed/research';

/**
 * 읽기(비로그인·비변경): Top Conference List(편집 UI 없음).
 * conference_page 싱글톤(SQL)에 시더가 PATCH로 conference 추가. 페이지는 language 무시(ko/en 동일).
 * 수정 날짜(modifiedAt)는 normalize-dates.sh가 고정, 작성자는 mock-login staff로 결정론적.
 */
test.describe('Top Conference List - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/research/top-conference-list');
    expect(res?.status()).toBe(200);
    // 목록 렌더 앵커 1개(나머지·픽셀은 스크린샷이 커버)
    await expect(
      page.getByText(RESEARCH_SEED.conferences[0].abbreviation).first(),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('top-conference-ko.png', {
      fullPage: true,
    });
  });
});
