import { expect, test } from '@playwright/test';
import { setLocale } from '../helpers/locale';

// Navigation and data views have different breakpoints (DS-023).
// These checks catch CSS/JS divergence during resize, beyond the fixed screenshot viewports.
test('중간 폭의 메뉴와 스크롤 제한이 함께 전환된다', async ({ page }) => {
  await setLocale(page, 'en');
  await page.goto('/en/about/overview');
  const menu = page.getByRole('button', { name: '메뉴 열기', exact: true });
  const desktopNav = page.locator('nav[aria-label="주 네비게이션"]').first();
  for (const width of [639, 640, 1023, 1024, 1199, 1200, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(width);
    if (width < 1200) {
      await expect(desktopNav).toBeHidden();
      await menu.click();
      await expect(page.locator('main')).toHaveCSS('overflow-y', 'hidden');
      await page
        .getByRole('button', { name: '메뉴 닫기', exact: true })
        .click();
      await expect(page.locator('main')).not.toHaveCSS('overflow-y', 'hidden');
    } else {
      await expect(menu).toBeHidden();
      await expect(desktopNav).toBeVisible();
    }
  }
});

test('예약 표시·날짜 이동과 교과목 보기가 콘텐츠 폭을 따른다', async ({
  page,
}) => {
  await setLocale(page, 'ko');
  for (const width of [1023, 1024, 1199, 1200]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(
      '/reservations/seminar-room/301-417?selectedDate=2024-03-15',
    );
    const columns = page.locator('time[datetime]').filter({ visible: true });
    await expect(columns).toHaveCount(width < 1024 ? 3 : 7);
    await page.getByRole('button', { name: '다음 날짜' }).click();
    const next = width < 1024 ? '2024-03-18' : '2024-03-22';
    await page.waitForURL(new RegExp(`selectedDate=${next}`));
    await expect(
      page.locator(`time[datetime="${next}"]`).filter({ visible: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: '이전 날짜' }).click();
    await page.waitForURL(/selectedDate=2024-03-15/);
    await expect(
      page.locator('time[datetime="2024-03-15"]').filter({ visible: true }),
    ).toBeVisible();
  }
  await page.goto('/academics/undergraduate/courses?view=카드형');
  const cards = page.getByRole('button', { name: '카드형', exact: true });
  const list = page.getByRole('button', { name: '목록형', exact: true });
  await page.setViewportSize({ width: 1023, height: 900 });
  await expect(cards).toBeHidden();
  await expect(page.locator('main svg.lucide-chevron-left')).toHaveCount(0);
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(cards).toBeVisible();
  await expect(
    page.locator('main svg.lucide-chevron-left').first(),
  ).toBeAttached();
  await list.click();
  await expect(page.locator('main svg.lucide-chevron-left')).toHaveCount(0);
  await cards.click();
  await expect(
    page.locator('main svg.lucide-chevron-left').first(),
  ).toBeAttached();
});
