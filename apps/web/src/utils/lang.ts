import type { Locale } from '@/types/i18n';

const COOKIE_NAME = 'lang';

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
