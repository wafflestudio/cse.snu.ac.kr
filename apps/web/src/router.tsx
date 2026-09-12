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

  // 페이지 조회 카운트(GoatCounter). 첫 로드는 여기서 한 번 세고(하이드레이션은 onResolved 를 내지 않고
  // onRendered 만 낸다), 그 뒤로는 경로나 검색 파라미터가 바뀐 클라 네비를 센다(페이지네이션·필터도
  // 새 콘텐츠를 보는 것). 해시만 바뀐 이동은 제외. 보내는 값은 pathname 이라 행은 경로 단위로 모인다.
  // count.js 는 async 라 아직 없을 수 있어 그 경우 스크립트 load 뒤에 보낸다.
  if (!import.meta.env.SSR) {
    const count = (path: string) => {
      if (window.goatcounter) {
        window.goatcounter.count({ path });
        return;
      }
      document
        .querySelector('script[src="/stats/count.js"]')
        ?.addEventListener('load', () => window.goatcounter?.count({ path }), {
          once: true,
        });
    };
    count(window.location.pathname);
    router.subscribe(
      'onResolved',
      ({ toLocation, pathChanged, hrefChanged, hashChanged }) => {
        if (pathChanged || (hrefChanged && !hashChanged)) {
          count(toLocation.pathname);
        }
      },
    );
  }

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
