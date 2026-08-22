import { createRouter } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { routeTree } from './routeTree.gen';
import { createNonce, getCSPHeaders } from './utils/csp';

// 요청별 CSP nonce 생성 + 보안 응답 헤더 설정(서버 전용).
// nonce는 router.options.ssr.nonce로 들어가 TanStack이 주입하는 모든 <script>에 스탬프된다
// (strict CSP에서 hydration이 안 깨지게). 클라에선 nonce 불필요 → undefined.
// dev(vite)는 HMR 인라인 스크립트가 많아 enforce 시 깨지므로 Report-Only.
const setupCsp = createIsomorphicFn()
  .server((): string => {
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
