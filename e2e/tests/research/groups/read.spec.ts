import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { RESEARCH_SEED } from '../../setup/seed/research';

/**
 * 읽기(비로그인·비변경): 연구·교육 스트림(groups). 상세는 인덱스 인라인(SelectionList + 선택 상세).
 * 그룹 상세의 연구실 목록(item.labs)은 백엔드가 비정렬 컬렉션으로 반환해 런마다 순서가 바뀜
 * → 해당 ul을 마스킹(콘텐츠 계약은 연구실 존재를 assert로 검증).
 */
test.describe('연구 스트림 - 읽기', () => {
  test('목록·상세 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/research/groups');
    expect(res?.status()).toBe(200);

    // 기본 선택 그룹(시스템) + 소속 연구실 목록
    await expect(page.getByText(RESEARCH_SEED.group.ko).first()).toBeVisible();
    await expect(
      page.getByText(RESEARCH_SEED.labs[0].ko).first(),
    ).toBeVisible();

    await expect(page).toHaveScreenshot('groups-ko.png', {
      fullPage: true,
      mask: [page.locator('ul').filter({ hasText: RESEARCH_SEED.labs[0].ko })],
    });
  });
});
