import type { Locale } from '~/types/i18n';

const COOKIE_NAME = 'lang';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * 언어를 쿠키로 설정하는 Set-Cookie 헤더를 생성합니다.
 */
export function getLangCookieHeader(locale: Locale): string {
  return `${COOKIE_NAME}=${locale}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax; Secure`;
}

/**
 * 사용자의 언어를 감지합니다.
 * 우선순위: 쿠키 > Accept-Language 헤더
 */
export function detectLang(request: Request): Locale {
  return detectLangFromHeaders({
    cookie: request.headers.get('cookie'),
    acceptLanguage: request.headers.get('accept-language'),
  });
}

/**
 * 헤더 값에서 직접 언어를 감지합니다(TanStack getRequestHeaders 등 Request 없이 호출).
 */
export function detectLangFromHeaders(input: {
  cookie?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  // 쿠키 확인
  const cookies = input.cookie;
  if (cookies) {
    const match = cookies.match(new RegExp(`${COOKIE_NAME}=(\\w+)`));
    const value = match?.[1];
    if (value === 'ko' || value === 'en') {
      return value;
    }
  }

  // Accept-Language 헤더 확인
  const acceptLanguage = input.acceptLanguage;
  if (!acceptLanguage) return 'ko';

  const languages = acceptLanguage.split(',').map((lang) => {
    const [code] = lang.trim().split(';');
    return code.toLowerCase();
  });

  // en, en-US, en-GB 등 모두 'en'으로 처리
  for (const lang of languages) {
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('ko')) return 'ko';
  }

  return 'ko'; // 기본값
}
