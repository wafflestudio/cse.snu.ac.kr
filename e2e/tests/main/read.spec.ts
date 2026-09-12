import { expect, test } from '@playwright/test';
import { setLocale } from '../helpers/locale';
import { NEWS_SEED, NOTICE_SEED } from '../setup/seed/community';

/**
 * 읽기(비로그인·비변경): 메인 페이지(/).
 * - NewsSection: isSlide 새소식(연구실 수상 소식) — 슬라이드 1개라 carousel 정지(pageCnt=1) → 결정론
 * - ImportantSection: isImportant 공지(학사 일정 안내)
 * - NoticeSection: 최근 공지(장학금 신청 공지)
 * NewsCard/NoticeSection 날짜는 normalize-dates.sh로 고정. baseline에 이미지 팝업 없음 → 오버레이 없음.
 * NewsCard 이미지는 시드에 유효 이미지가 없어, ui/Image가 로드 시도(<img>) → 실패 시 폴백 <div>(SNU 로고)로
 * 엘리먼트 타입 자체가 바뀐다 → 스크린샷 타이밍에 따라 비결정적. img/div 둘 다 갖는 `.object-cover` 클래스를
 * 마스킹(외부/불안정 미디어 마스킹 컨벤션). 제목/날짜는 그대로 비교.
 */
test.describe('메인 - 읽기', () => {
  test('주요 섹션이 렌더된다 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);

    await expect(page.getByText(NEWS_SEED[0].title).first()).toBeVisible();
    await expect(page.getByText(NOTICE_SEED[0].title).first()).toBeVisible();
    await expect(page).toHaveScreenshot('main-ko.png', {
      fullPage: true,
      mask: [page.locator('a[href*="/community/news/"] .object-cover')],
    });
  });
});
