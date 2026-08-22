import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { BASE_URL } from '@/constants/api';
import type { Role } from '@/store';

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

/**
 * 세션의 역할 목록. `ROLE_ANONYMOUS`는 제외하므로 **빈 배열 = 비로그인**이다.
 * 실패해도 빈 배열을 반환한다(백엔드 장애로 화면이 통째로 죽지 않게).
 *
 * `/v2/user/my-role`은 비로그인에도 200 + `ROLE_ANONYMOUS`를 주므로 리다이렉트를 타지 않는다
 * — 백엔드의 다른 인증 필요 엔드포인트가 302 OAuth로 응답하는 것과 다르다(그쪽은 앱이
 * 리다이렉트를 따라갈 수 없어 loader가 실패한다).
 */
export async function fetchSessionRoles(): Promise<Role[]> {
  try {
    const response = await fetch(`${BASE_URL}/v2/user/my-role`, {
      headers: forwardAuthHeaders(),
    });
    if (!response.ok) return [];
    const { roles }: { roles: string[] } = await response.json();
    return roles.filter((r) => r !== 'ROLE_ANONYMOUS') as Role[];
  } catch {
    return [];
  }
}

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
