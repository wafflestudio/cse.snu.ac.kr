import { expect, test } from '@playwright/test';

/**
 * 교내 웹취약점 점검(wscan) 회귀 가드 — 비로그인·DB 비변경이라 read 단계에서 병렬 실행.
 *
 * 2026-08-19 점검에서 20건이 잡혔고 그중 16건이 **프론트 소유**였다. 전부 "화면은 맞는데
 * HTTP 응답이 틀린" 종류라 렌더만 보는 read 스펙이 놓쳤다. 스캐너는 사람이 보는 화면이
 * 아니라 상태 코드와 헤더만 본다 → 그 층을 여기서 직접 단언한다.
 *
 * 라우트별로 반복하지 않는다(와이어링 모양당 1번). 전부 백엔드 무관.
 */

/**
 * 점검이 "디폴트 페이지 노출"(높음 8건)·"관리자 페이지 노출"(보통 5건)로 잡은 실제 경로들.
 * 전부 존재하지 않는 경로인데 200을 반환해 스캐너가 "접근 가능한 페이지"로 판정했다
 * (본문은 이미 404 화면이었다 — 상태 코드만 틀렸다). 13건이 이 한 가지 원인이었다.
 */
const SCANNED_MISSING_PATHS = [
  // 디폴트/샘플 페이지 노출로 잡힌 경로
  '/docs',
  '/axis/samples',
  '/examples',
  '/sample',
  '/samples',
  '/example',
  '/webapps/examples',
  '/webapps/axis/samples',
  // 관리자 페이지 노출로 잡힌 경로 중 실재하지 않는 것(`/admin`은 실재 → 아래 별도 검증)
  '/administrator',
  '/manager',
  '/manage',
  '/console',
  '/administration',
];

test.describe('없는 경로는 404 상태를 반환한다', () => {
  for (const path of SCANNED_MISSING_PATHS) {
    test(`${path} → 404`, async ({ request }) => {
      // 스캐너와 같은 조건: 렌더 없이 HTTP 응답만, 리다이렉트는 따라간다
      // (bare 경로는 로케일 프리픽스로 307 → 최종 응답이 404여야 한다).
      const response = await request.get(path);
      expect(response.status()).toBe(404);
    });
  }

  test('로케일 프리픽스가 붙은 없는 경로도 404 (ko·en)', async ({
    request,
  }) => {
    expect((await request.get('/ko/없는길')).status()).toBe(404);
    expect((await request.get('/en/no-such-path')).status()).toBe(404);
  });
});

test.describe('관리자 페이지는 익명에게 200을 주지 않는다', () => {
  /**
   * 점검이 `/admin` 200을 "관리자 페이지 노출"(보통)로 잡았다.
   *
   * **500도 안 된다** — 스캐너 프로파일엔 `[높음] 애플리케이션 오류` 규칙이 있어서, 게이트
   * 없이 두면 보통 1건이 높음 1건으로 바뀔 뿐이다(게이트 이전 실측값이 정확히 500이었다:
   * 백엔드가 비로그인에 401/403이 아니라 302 OAuth 리다이렉트를 주는데 앱이 그 최종 URL에
   * 도달하지 못해 loader가 실패). 그래서 404를 명시적으로 요구한다.
   */
  test('/admin → 404', async ({ request }) => {
    const response = await request.get('/admin');
    expect(response.status()).toBe(404);
  });
});

test.describe('CSP·보안 헤더', () => {
  test('CSP에 http: 오리진이 없고 요청마다 nonce가 바뀐다', async ({
    request,
  }) => {
    const first = await request.get('/ko');
    expect(first.status()).toBe(200);

    const csp = first.headers()['content-security-policy'];
    expect(csp, 'CSP 헤더가 있어야 한다').toBeTruthy();

    // 점검이 "부적절한 CSP 설정"(높음 2건)으로 잡은 항목. HTTPS 페이지에선 혼합 콘텐츠
    // 차단 때문에 어차피 죽은 항목이면서 중간자 공격 노출로 판정된다.
    expect(csp, `CSP에 http: 오리진이 있다: ${csp}`).not.toMatch(/\bhttp:\/\//);

    // strict CSP의 근거. nonce가 응답마다 고유해야 재사용 우회가 막힌다.
    const nonceOf = (v: string) => v.match(/'nonce-([a-f0-9]+)'/)?.[1];
    const firstNonce = nonceOf(csp);
    expect(firstNonce).toBeTruthy();

    const second = await request.get('/ko');
    const secondNonce = nonceOf(second.headers()['content-security-policy']);
    expect(secondNonce).not.toBe(firstNonce);
  });

  test('보안 응답 헤더가 붙는다', async ({ request }) => {
    // app/router.tsx가 마감한다. ISR(nginx) 보류로 앱이 다시 소유하게 된 부분이라
    // 엣지 구성이 바뀌어도 앱이 자립적으로 내는지 여기서 지킨다.
    const headers = (await request.get('/ko')).headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['strict-transport-security']).toBeTruthy();
  });
});
