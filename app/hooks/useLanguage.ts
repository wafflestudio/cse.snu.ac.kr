import { useLocation, useNavigate } from 'react-router';
import type { Locale } from '~/types/i18n';

type Translations = Record<string, string>; // 한국어 -> 영어

interface UseLanguageBase {
  locale: Locale;
  isEnglish: boolean;
  pathWithoutLocale: string;
  changeLanguage: () => void;
  localizedPath: (path: string) => string;
}

export interface UseLanguageReturn extends UseLanguageBase {
  t?: (koreanKey: string) => string;
}

interface UseLanguageWithTranslations extends UseLanguageBase {
  t: (koreanKey: string) => string;
}

// Overload signatures
export function useLanguage(): UseLanguageBase;
export function useLanguage(
  translations: Translations,
): UseLanguageWithTranslations;
export function useLanguage(translations?: Translations): UseLanguageReturn {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const locale = pathname.startsWith('/en') ? 'en' : 'ko';
  const isEnglish = locale === 'en';
  const pathWithoutLocale = pathname.replace(/^\/en/, '') || '/';

  const changeLanguage = () => {
    const newLocale = isEnglish ? 'ko' : 'en';
    if (newLocale === 'en') {
      navigate(`/en${pathWithoutLocale}${search}`);
    } else {
      navigate(`${pathWithoutLocale}${search}`);
    }
  };

  const localizedPath = (path: string): string => {
    return isEnglish ? `/en${path}` : path;
  };

  // If translations provided, create translation function
  const t = translations
    ? (koreanKey: string): string => {
        if (locale === 'ko') return koreanKey;
        return translations[koreanKey] || koreanKey;
      }
    : undefined;

  return {
    locale,
    isEnglish,
    pathWithoutLocale,
    changeLanguage,
    localizedPath,
    t,
  };
}
