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
 *
 * RR loader의 `headers: request.headers` 패턴을 대체한다.
 */
export const forwardAuthHeaders = createIsomorphicFn()
  .server((): HeadersInit => {
    // getRequestHeaders()는 Headers 객체 → .get() 사용(프로퍼티 접근은 undefined).
    const cookie = getRequestHeaders().get('cookie');
    return cookie ? { cookie } : {};
  })
  .client((): HeadersInit => ({}));
