import { createRouter } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { routeTree } from './routeTree.gen';
import { createNonce, getCSPHeaders } from './utils/csp';

// 요청별 CSP nonce 생성 + 보안 응답 헤더 설정(서버 전용).
// nonce는 router.options.ssr.nonce로 들어가 TanStack이 주입하는 모든 <script>에 스탬프된다
// (strict CSP에서 hydration이 안 깨지게). 클라에선 nonce 불필요 → undefined.
// dev(vite)는 HMR 인라인 스크립트가 많아 enforce 시 깨지므로 Report-Only.
//
// ISR(nginx 캐싱) 모드(`BEHIND_NGINX=1`): 본문엔 placeholder nonce만 박고 CSP·보안 헤더는
// 내보내지 않는다 → 캐시된 HTML이라도 nginx가 매 요청 placeholder를 $request_id로 치환 +
// 같은 값으로 CSP 헤더를 세팅해 nonce를 응답별 고유로 유지(docs/isr-csp-caching-plan.md).
// placeholder는 entrypoint가 기동마다 만든 **랜덤 비밀**(CSP_NONCE_PLACEHOLDER). 고정 마법문자열이면
// 공격자가 콘텐츠에 심어 nginx가 유효 nonce를 찍어주는 우회가 가능 → 비밀이라 못 주입한다.
// dev·E2E preview(nginx 없음)는 게이트 off → 앱이 진짜 nonce를 만들고 헤더도 직접 세팅(현행).
const setupCsp = createIsomorphicFn()
  .server((): string => {
    if (process.env.BEHIND_NGINX === '1') {
      return process.env.CSP_NONCE_PLACEHOLDER ?? '__CSP_NONCE__';
    }
    const nonce = createNonce();
    setResponseHeader(
      import.meta.env.PROD
        ? 'Content-Security-Policy'
        : 'Content-Security-Policy-Report-Only',
      getCSPHeaders(nonce),
    );
    setResponseHeader('X-Frame-Options', 'SAMEORIGIN');
    setResponseHeader('X-Content-Type-Options', 'nosniff');
    setResponseHeader('Strict-Transport-Security', 'max-age=3600');
    return nonce;
  })
  .client((): string | undefined => undefined);

export function getRouter() {
  const nonce = setupCsp();
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    ssr: { nonce },
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
