import type { Locale } from '@/types/i18n';

/**
 * Storybook 전용 `@/lib/serverFns` 모킹.
 * 실제 `setLangCookie`는 `@tanstack/react-start`의 `createServerFn(...).validator(...)`로
 * 만들어지는데, SB의 브라우저 전용 환경에선 createServerFn 스텁이 `.validator` 체인을
 * 지원하지 않아 모듈 로드 시점에 throw → useLanguage를 쓰는 모든 컴포넌트가 렌더 실패.
 * SB에선 쿠키 설정이 의미 없으므로 no-op 프로미스로 대체한다(.storybook/main.ts에서 alias).
 */
export const setLangCookie = (_args: {
  data: Locale;
}): Promise<{ ok: boolean }> => Promise.resolve({ ok: true });
