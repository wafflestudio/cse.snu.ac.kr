import type { Page } from '@playwright/test';

/**
 * 페이지 상단의 언어 전환 버튼 클릭 (KO/ENG)
 * 페이지 로드를 자동으로 기다립니다.
 */
export async function switchPageLanguage(page: Page, lang: 'ko' | 'en') {
  const buttonName = lang === 'ko' ? 'KO' : 'ENG';
  await page.getByRole('button', { name: buttonName }).click();
  await page.waitForURL(`**/${lang}/**`);
}
