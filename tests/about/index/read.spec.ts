import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';

/** 읽기(비로그인·비변경). /about 인덱스: 정적 CategoryPage. */
test.describe('소개 인덱스 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/about');
    expect(res?.status()).toBe(200);

    await expect(page.getByText('Meet CSE')).toBeVisible();
    // 하위 카테고리 카드(네비 children)
    await expect(page.getByText('졸업생 진로').first()).toBeVisible();
    await expect(page).toHaveScreenshot('about-index-ko.png', {
      fullPage: true,
    });
  });
});
