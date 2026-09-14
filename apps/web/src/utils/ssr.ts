import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

/**
 * 로케일 감지를 위한 요청 헤더(cookie/accept-language).
 * - 서버: 실제 요청 헤더.
 * - 클라: null(클라 네비게이션은 Link가 이미 localized → 리다이렉트 불필요).
 */
export const readLangHeaders = createIsomorphicFn()
  .server((): { cookie: string | null; acceptLanguage: string | null } => {
    // getRequestHeaders()는 Headers 객체 → .get() 사용.
    const h = getRequestHeaders();
    return {
      cookie: h.get('cookie'),
      acceptLanguage: h.get('accept-language'),
    };
  })
  .client(
    (): { cookie: string | null; acceptLanguage: string | null } | null => null,
  );

/**
 * 백엔드 fetch에 전달할 인증 헤더(쿠키).
 * - 서버(SSR): 들어온 요청의 cookie를 백엔드로 포워딩(세션 유지).
 * - 클라: same-origin fetch가 쿠키를 자동으로 싣는다 → 빈 객체.
 */
export const forwardAuthHeaders = createIsomorphicFn()
  .server((): HeadersInit => {
    // getRequestHeaders()는 Headers 객체 → .get() 사용(프로퍼티 접근은 undefined).
    const cookie = getRequestHeaders().get('cookie');
    return cookie ? { cookie } : {};
  })
  .client((): HeadersInit => ({}));

/**
 * 사이트 절대 origin(hreflang 등 절대 URL 생성용).
 * - 서버: 요청 host + proto(엣지 프록시면 x-forwarded-proto).
 * - 클라: window.location.origin.
 * hreflang은 상대 URL을 신뢰하지 않으므로 절대 URL이 필요하다.
 */
export const getSiteOrigin = createIsomorphicFn()
  .server((): string => {
    const h = getRequestHeaders();
    const host = h.get('host');
    if (!host) return '';
    const proto = h.get('x-forwarded-proto') ?? 'https';
    return `${proto}://${host}`;
  })
  .client((): string =>
    typeof window !== 'undefined' ? window.location.origin : '',
  );

/**
 * 조회 통계(GoatCounter) 스크립트를 실을지. `/stats` 라우트가 있는 배포에만 켠다.
 * - 서버: 런타임 env.
 * - 클라: 서버가 head에 심어둔 태그를 되읽는다. loader는 isomorphic이라 클라 재실행에서도
 *   같은 답이 나와야 한다 — process.env를 그대로 읽으면 클라에선 {} 셰임이라 항상 false다.
 */
export const isStatsEnabled = createIsomorphicFn()
  .server((): boolean => process.env.STATS_ENABLED === 'true')
  .client(
    (): boolean =>
      typeof document !== 'undefined' &&
      document.querySelector('script[data-goatcounter]') !== null,
  );
