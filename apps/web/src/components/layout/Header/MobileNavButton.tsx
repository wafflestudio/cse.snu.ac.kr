import { Menu, X } from 'lucide-react';
import { navigationTree } from '@/constants/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useStore } from '@/store';

export default function MobileNavButton() {
  const navbarState = useStore((s) => s.navbarState);
  const hoverNavItem = useStore((s) => s.hoverNavItem);
  const closeNavbar = useStore((s) => s.closeNavbar);
  const { pathWithoutLocale } = useLanguage();

  const topLevelNavItem = navigationTree.find(
    (item) => item.path && pathWithoutLocale.startsWith(item.path),
  );

  const isOpen = navbarState.type !== 'closed';

  const toggleNav = () => {
    if (isOpen) {
      closeNavbar();
    } else {
      const itemToOpen = topLevelNavItem || navigationTree[0]; // 기본값: 첫 번째 카테고리
      hoverNavItem(itemToOpen);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleNav}
      className="flex items-center justify-center sm:hidden"
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
    >
      {isOpen ? (
        <X className="size-4 text-white" />
      ) : (
        <Menu className="size-4 text-white" />
      )}
    </button>
  );
}
