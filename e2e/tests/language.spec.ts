import { expect, test } from '@playwright/test';
import { setLocale } from './helpers/locale';
import { ABOUT_SEED } from './setup/seed/about';

/**
 * 로케일 라우팅 검증 — 항상 프리픽스(/ko·/en) + bare 경로 리다이렉트.
 *
 * read/flow가 ko 렌더·en 쓰기만 캡처하는 것과 별개로, 리다이렉트·우선순위·토글·hreflang
 * 와이어링을 **와이어링 모양당 1번씩** 검증한다(전 라우트 반복 X — 백엔드 무관·중복).
 * 전부 프론트 소유(`__root` beforeLoad·`useLanguage`).
 *
 * 대표 라우트: about/overview(콘텐츠 싱글톤, baseline에 항상 존재·안정).
 */
const PATH = '/about/overview';
const KO = '/ko/about/overview';

test.describe('자동 감지 — bare 경로는 로케일 프리픽스로 리다이렉트', () => {
  test.describe('Accept-Language: ko', () => {
    test.use({ locale: 'ko-KR' });
    test('쿠키 없으면 Accept-Language로 /ko 부여', async ({ page }) => {
      await page.goto(PATH);
      await expect(page).toHaveURL(/\/ko\/about\/overview$/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    });
  });

  test.describe('Accept-Language: en', () => {
    test.use({ locale: 'en-US' });
    test('쿠키 없으면 Accept-Language로 /en 부여', async ({ page }) => {
      await page.goto(PATH);
      await expect(page).toHaveURL(/\/en\/about\/overview$/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });
    test('쿠키(lang=ko)가 Accept-Language(en)를 이긴다 — 우선순위', async ({
      page,
    }) => {
      await setLocale(page, 'ko');
      await page.goto(PATH);
      await expect(page).toHaveURL(/\/ko\/about\/overview$/);
    });
  });
});

test.describe('언어 토글(스위처) + 쿠키 persist', () => {
  test('ko ↔ en 전환 시 URL·html lang·lang 쿠키가 함께 바뀐다', async ({
    page,
  }) => {
    await setLocale(page, 'ko');
    await page.goto(KO);

    await page.getByRole('button', { name: 'ENG' }).click();
    await page.waitForURL(/\/en\/about\/overview$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText(ABOUT_SEED.overview.en)).toBeVisible();
    const afterEn = await page.context().cookies();
    expect(afterEn.find((c) => c.name === 'lang')?.value).toBe('en');

    await page.getByRole('button', { name: '한국어' }).click();
    await page.waitForURL(/\/ko\/about\/overview$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    const afterKo = await page.context().cookies();
    expect(afterKo.find((c) => c.name === 'lang')?.value).toBe('ko');
  });
});

test.describe('회귀 가드 — /ko 직접 진입(과거 strip 렌더 루프)', () => {
  test('프리픽스 경로는 strip 없이 안정 렌더, URL 그대로 유지', async ({
    page,
  }) => {
    await setLocale(page, 'ko');
    const res = await page.goto(KO);
    expect(res?.status()).toBe(200);
    await expect(page.getByText(ABOUT_SEED.overview.ko)).toBeVisible();
    await expect(page).toHaveURL(/\/ko\/about\/overview$/);
  });
});

test.describe('hreflang 대체 링크(SEO)', () => {
  test('ko/en/x-default 링크가 대칭으로 존재', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto(KO);
    const ko = await page.locator('link[hreflang="ko"]').getAttribute('href');
    const en = await page.locator('link[hreflang="en"]').getAttribute('href');
    const xd = await page
      .locator('link[hreflang="x-default"]')
      .getAttribute('href');
    expect(ko).toContain('/ko/about/overview');
    expect(en).toContain('/en/about/overview');
    expect(xd).toContain('/ko/about/overview');
  });
});

test.describe('모바일 언어 토글', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('모바일 네비에서 ko → en 전환', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto(KO);
    await page.getByRole('button', { name: '메뉴 열기' }).click();
    await page.getByRole('button', { name: 'ENG' }).click();
    await page.waitForURL(/\/en\/about\/overview$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
