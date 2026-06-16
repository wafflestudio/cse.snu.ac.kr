import { expect, test } from '@playwright/test';
import { setLocale } from '../helpers/locale';
import { NOTICE_SEED } from '../setup/seed/community';

/**
 * 읽기(비로그인·비변경): 통합 검색(/search). 상태는 URL 우선(`?keyword=`).
 * 도달 가능한 화면: 빈 검색 박스 · 한 글자 안내 · 결과 노출 · 빈 결과.
 * 백엔드 FTS(#398) 적용 후 시드 공지가 검색된다.
 */
test.describe('통합 검색 - 읽기', () => {
  test('검색 페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/search');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('통합 검색').first()).toBeVisible();
    await expect(page).toHaveScreenshot('search-ko.png', { fullPage: true });
  });

  test('한 글자 키워드는 안내 메시지를 보여준다 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/search?keyword=a');
    await expect(
      page.getByText('검색어를 두글자 이상 입력해주세요'),
    ).toBeVisible();
  });

  test('키워드 검색 결과에 시드 공지가 노출된다 (ko)', async ({ page }) => {
    const title = NOTICE_SEED[0].title; // '학사 일정 안내'
    await setLocale(page, 'ko');
    await page.goto(`/search?keyword=${encodeURIComponent(title)}`);
    await expect(page.getByText(title).first()).toBeVisible();
    await expect(page).toHaveScreenshot('search-result-ko.png', {
      fullPage: true,
    });
  });

  test('결과 없는 키워드는 빈 상태를 보여준다 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/search?keyword=존재하지않는키워드zzqq');
    // 검색 박스(페이지 셸)는 그대로 렌더되고 결과만 0건
    await expect(page.getByText('통합 검색').first()).toBeVisible();
    await expect(page).toHaveScreenshot('search-empty-ko.png', {
      fullPage: true,
    });
  });
});
