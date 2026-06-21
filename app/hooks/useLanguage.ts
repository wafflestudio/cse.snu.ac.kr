import { useLocation } from '@tanstack/react-router';
import commonTranslations from '@/translations.json';
import type { Locale } from '@/types/i18n';
import { setLangCookie } from '@/utils/serverFns';

interface UseLanguageBase {
  locale: Locale;
  isEnglish: boolean;
  pathWithoutLocale: string;
  changeLanguage: () => void;
  localizedPath: (path: string) => string;
}

interface UseLanguageWithTranslations<T extends Record<string, string>>
  extends UseLanguageBase {
  t: (koreanKey: keyof T & string) => string; // type-safe
  tUnsafe: (koreanKey: string) => string; // 동적 키 허용
}

type CommonTranslations = typeof commonTranslations;
type CommonTranslationsKey = keyof CommonTranslations;

// Overload signatures
export function useLanguage(): UseLanguageWithTranslations<CommonTranslations>;
export function useLanguage<T extends Record<string, string>>(
  translations: T,
): UseLanguageWithTranslations<CommonTranslations & T>;
export function useLanguage<T extends Record<string, string>>(
  translations?: T,
):
  | UseLanguageWithTranslations<CommonTranslations>
  | UseLanguageWithTranslations<CommonTranslations & T> {
  const { pathname } = useLocation();

  const locale = pathname.startsWith('/en') ? 'en' : 'ko';
  const isEnglish = locale === 'en';
  // 모든 라우트가 로케일 프리픽스를 가지므로(/ko·/en) 둘 다 strip.
  const pathWithoutLocale = pathname.replace(/^\/(en|ko)/, '') || '/';

  const changeLanguage = () => {
    const newLocale: Locale = isEnglish ? 'ko' : 'en';

    // 쿠키 설정(서버) 후 반대 로케일 프리픽스로 전체 네비게이트 → root beforeLoad가
    // 새 로케일로 렌더(RR의 /lang action + revalidate 리다이렉트 대체).
    setLangCookie({ data: newLocale }).then(() => {
      const rest = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
      window.location.assign(`/${newLocale}${rest}`);
    });
  };

  // 항상 로케일 프리픽스를 붙인다(ko도 /ko). bare 경로를 만들지 않아 root의
  // 리다이렉트 라운드트립(과거 /ko-strip 렌더 루프)을 원천 제거한다.
  const localizedPath = (path: string): string => {
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  // Merge commonTranslations with provided translations
  const mergedTranslations = {
    ...commonTranslations,
    ...(translations || {}),
  };

  const translateFn = (koreanKey: CommonTranslationsKey & keyof T): string => {
    if (locale === 'ko') return koreanKey;
    return mergedTranslations[koreanKey] || koreanKey;
  };

  return {
    locale,
    isEnglish,
    pathWithoutLocale,
    changeLanguage,
    localizedPath,
    t: translateFn,
    tUnsafe: translateFn as (koreanKey: string) => string,
  };
}
