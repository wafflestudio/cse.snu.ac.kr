import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';

/** 읽기(비로그인·비변경). 시설 예약 안내(정적, SelectionList 3개 + 하드코딩 HTML). */
test.describe('시설 예약 안내 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/reservations/introduction');
    expect(res?.status()).toBe(200);

    // SelectionList 3개 항목 + 기본 선택(세미나실 예약) 본문 일부
    await expect(page.getByText('실습실 예약').first()).toBeVisible();
    await expect(page.getByText('공과대학 강의실 예약').first()).toBeVisible();
    await expect(
      page.getByText('로그인 후 하위 메뉴에서', { exact: false }).first(),
    ).toBeVisible();

    await expect(page).toHaveScreenshot('reservations-introduction-ko.png', {
      fullPage: true,
    });
  });
});
