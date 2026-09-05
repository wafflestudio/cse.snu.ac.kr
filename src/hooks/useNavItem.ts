import { findNavItemByPath } from '@/constants/navigation';
import { useLanguage } from '@/hooks/useLanguage';

export function useNavItem() {
  const { pathWithoutLocale } = useLanguage();
  return { activeItem: findNavItemByPath(pathWithoutLocale) };
}
