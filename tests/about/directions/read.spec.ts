import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { DIRECTIONS_SEED } from '../../setup/seed/about';

/**
 * 읽기(비로그인·비변경): SelectionList(경로 항목) + 선택 상세(description).
 * directions는 SQL 시드(생성 API 없음). 기본 선택은 koName 오름차순 첫 항목(대중교통).
 * KakaoMap(#map)은 외부 SDK(테스트 빌드엔 API 키 없음)라 비결정적 → 마스킹.
 */
test.describe('찾아오는 길 - 읽기', () => {
  test('페이지 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/about/directions');
    expect(res?.status()).toBe(200);

    // 목록 렌더 앵커 1개(기본 선택 항목, 나머지·픽셀은 스크린샷이 커버)
    await expect(
      page.getByText(DIRECTIONS_SEED[0].ko.name).first(),
    ).toBeVisible();

    // 비주얼은 기본 선택(koName 오름차순 첫 항목) 상태에서 캡처 — 클릭 전에 찍는다
    await expect(page).toHaveScreenshot('directions-ko.png', {
      fullPage: true,
      mask: [page.locator('#map')],
    });

    // 상세: 기본 선택이 아닌 항목(자가용=링크)을 눌러 설명 렌더 확인
    await page.getByRole('link', { name: DIRECTIONS_SEED[1].ko.name }).click();
    await expect(
      page.getByText(DIRECTIONS_SEED[1].ko.description),
    ).toBeVisible();
  });
});
