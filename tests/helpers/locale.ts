import { expect, type Page } from '@playwright/test';

/**
 * 언어를 결정론적으로 고정합니다.
 *
 * 앱은 언어를 `lang` 쿠키(1순위) → Accept-Language(2순위)로 결정하고 URL prefix(/en)를
 * 거기에 맞춰 강제 리다이렉트합니다. Playwright 크로뮴의 기본 Accept-Language는 en-US라,
 * 쿠키를 고정하지 않으면 `/research/labs`(한글) 방문이 `/en/...`으로 리다이렉트되어
 * 테스트가 흔들립니다. navigate 전에 호출하세요.
 */
export async function setLocale(page: Page, locale: 'ko' | 'en') {
  await page
    .context()
    .addCookies([
      { name: 'lang', value: locale, domain: 'localhost', path: '/' },
    ]);
  // 결정론: LeftNav는 마우스 hover 시 펼쳐져(onMouseEnter) 스크린샷이 비결정적이 된다
  // (커서가 사이드바 위면 expand → 닫힘/펼침이 런마다 달라짐). 커서를 사이드바 밖(헤더 영역)으로
  // 두어 항상 닫힌 상태로 고정한다. 모바일(390px)엔 LeftNav가 없어 무해. goto 전에 호출되므로 유지됨.
  await page.mouse.move(300, 8);
}

/**
 * en round-trip(이중언어 쓰기 검증): 현재 ko 상세 페이지에서 `/en` 상세로 이동해 입력한 en 값이
 * heading으로 노출되는지 확인하고, ko 컨텍스트로 복귀한다(이후 편집/삭제 단계 계속 가능).
 * 상세 URL이 `/:id`로 안정적인 엔티티(faculty/emeritus/staff/labs/scholarship)에서 사용.
 * 목록 인라인 상세(centers/groups)나 싱글톤(admissions/greetings)은 경로가 달라 스펙에서 직접 검증.
 */
export async function expectEnDetailHeading(page: Page, enValue: string) {
  const detailPath = new URL(page.url()).pathname;
  await setLocale(page, 'en');
  await page.goto(`/en${detailPath}`);
  await expect(page.getByRole('heading', { name: enValue })).toBeVisible();
  await setLocale(page, 'ko');
  await page.goto(detailPath);
}
