import { expect, test } from '@playwright/test';

/**
 * 교내 웹취약점 점검(wscan) 회귀 가드 — 비로그인·DB 비변경이라 read 단계에서 병렬 실행.
 *
 * **스캐너는 사람이 보는 화면이 아니라 상태 코드와 헤더만 본다.** 렌더만 단언하는 read
 * 스펙은 "화면은 맞는데 HTTP 응답이 틀린" 상태를 통과시킨다 — 2026-08 점검의 20건 중
 * 대부분이 그 종류였다. 그 층을 여기서 직접 단언한다.
 *
 * 라우트별로 반복하지 않는다(와이어링 모양당 1번). 전부 백엔드 무관이라 baseURL만 바꾸면
 * staging·prod 실환경에도 그대로 쏠 수 있다.
 */

/**
 * 점검이 "디폴트 페이지 노출"·"관리자 페이지 노출"로 잡은 실제 경로들. 전부 존재하지 않는
 * 경로인데 200을 반환해 "접근 가능한 페이지"로 판정됐다(본문은 이미 404 화면이었고 상태
 * 코드만 틀렸다). 20건 중 13건이 이 한 가지 원인이었다.
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
      expect((await request.get(path)).status()).toBe(404);
    });
  }

  test('로케일 프리픽스가 붙은 없는 경로도 404 (ko·en)', async ({
    request,
  }) => {
    expect((await request.get('/ko/없는길')).status()).toBe(404);
    expect((await request.get('/en/no-such-path')).status()).toBe(404);
  });
});

test.describe('관리자 페이지', () => {
  /**
   * `/admin`은 실재하는 라우트라 위 스윕과 별개다. 200이면 "관리자 페이지 노출"로 잡히고,
   * **500이어도 안 된다** — 스캐너 프로파일에 `[높음] 애플리케이션 오류` 규칙이 있어 보통
   * 1건이 높음 1건으로 바뀔 뿐이다. 게이트가 없으면 정확히 500이 난다(`admin/index.tsx` 주석).
   */
  test('익명 접근은 404', async ({ request }) => {
    expect((await request.get('/admin')).status()).toBe(404);
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

    // HTTPS 페이지에선 혼합 콘텐츠 차단으로 어차피 죽은 항목이면서, 점검은 중간자 공격
    // 노출로 판정한다("부적절한 CSP 설정" 높음).
    expect(csp, `CSP에 http: 오리진이 있다: ${csp}`).not.toMatch(/\bhttp:\/\//);

    // strict CSP의 근거. nonce가 응답마다 고유해야 재사용 우회가 막힌다.
    const nonceOf = (v: string) => v.match(/'nonce-([a-f0-9]+)'/)?.[1];
    const firstNonce = nonceOf(csp);
    expect(firstNonce).toBeTruthy();

    const second = await request.get('/ko');
    expect(nonceOf(second.headers()['content-security-policy'])).not.toBe(
      firstNonce,
    );
  });

  test('보안 응답 헤더가 붙는다', async ({ request }) => {
    // `src/router.tsx`가 마감한다. 엣지(Caddy)도 일부를 내지만, 엣지 구성이 바뀌어도
    // 앱이 자립적으로 내는지를 여기서 지킨다.
    const headers = (await request.get('/ko')).headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['strict-transport-security']).toBeTruthy();
  });
});
