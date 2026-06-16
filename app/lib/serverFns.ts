import { createServerFn } from '@tanstack/react-start';
import { setCookie } from '@tanstack/react-start/server';
import type { Locale } from '~/types/i18n';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * 언어 설정 쿠키를 서버에서 설정한다(RR `/lang` action 대체).
 * 클라이언트(언어 토글)에서 호출 → 쿠키 set 후 호출부가 localized 경로로 네비게이트.
 */
export const setLangCookie = createServerFn({ method: 'POST' })
  .validator((lang: Locale) => lang)
  .handler(({ data }) => {
    setCookie('lang', data, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    return { ok: true };
  });
