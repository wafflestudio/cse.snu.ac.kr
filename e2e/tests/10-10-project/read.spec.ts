import { expect, test } from '@playwright/test';
import { setLocale } from '../helpers/locale';

/**
 * 읽기(비로그인·비변경): 콘텐츠 계약(핵심 1~2개) + 비주얼 회귀를 한 파일에서.
 * ko 전용, 데스크톱(read)·모바일 390px(read-mobile) 프로젝트가 같은 스펙을 돌린다.
 *
 * 10-10 Project: 모두 정적 페이지(index=CategoryPage, 나머지=하드코딩 HTML).
 * 인덱스 제목 'Project'는 SubNavbar(`hidden sm:block`)에도 반복되므로, 모바일에서도
 * 보이는 각 페이지의 PageTitle(h3)을 콘텐츠 계약으로 assert한다.
 */
test.describe('10-10 Project - 읽기', () => {
  test('/10-10-project (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/10-10-project');
    expect(res?.status()).toBe(200);
    // 인덱스(CategoryPage)는 subNav가 없어 PageTitle만 '10-10 Project'를 노출
    await expect(page.getByText('10-10 Project').first()).toBeVisible();
    await expect(page).toHaveScreenshot('10-10-index-ko.png', {
      fullPage: true,
    });
  });

  const SUBPAGES: [string, string, string][] = [
    ['/10-10-project/proposal', '10-10-proposal-ko.png', 'Proposal'],
    ['/10-10-project/manager', '10-10-manager-ko.png', 'Manager'],
    [
      '/10-10-project/participants',
      '10-10-participants-ko.png',
      'Participants(Professors)',
    ],
  ];

  for (const [path, snapshot, heading] of SUBPAGES) {
    test(`${path} (ko)`, async ({ page }) => {
      await setLocale(page, 'ko');
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      // PageTitle(h3)은 모바일에서도 보임. 'Proposal' 등은 subNav에선 링크라 heading 역할로 유일.
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      await expect(page).toHaveScreenshot(snapshot, { fullPage: true });
    });
  }
});
