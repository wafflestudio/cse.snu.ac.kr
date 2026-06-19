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
  const pathWithoutLocale = pathname.replace(/^\/en/, '') || '/';

  const changeLanguage = () => {
    const newLocale: Locale = isEnglish ? 'ko' : 'en';

    // 쿠키 설정(서버) 후 localized 경로로 전체 네비게이트 → root beforeLoad가
    // 새 로케일로 렌더(RR의 /lang action + revalidate 리다이렉트 대체).
    setLangCookie({ data: newLocale }).then(() => {
      const target =
        newLocale === 'en' ? `/en${pathWithoutLocale}` : pathWithoutLocale;
      window.location.assign(target);
    });
  };

  const localizedPath = (path: string): string => {
    return isEnglish ? `/en${path}` : path;
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
