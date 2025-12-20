import { Button } from '~/components/ui/button';
import { navigationTree } from '~/constants/navigation';
import { useNavItem } from '~/hooks/useNavItem';
import { useStore } from '~/store';
import MenuSVG from './assets/menu.svg?react';

export default function MobileNavButton() {
  const navbarState = useStore((s) => s.navbarState);
  const hoverNavItem = useStore((s) => s.hoverNavItem);
  const closeNavbar = useStore((s) => s.closeNavbar);
  const { topLevelItem: topLevelNavItem } = useNavItem();

  const isOpen = navbarState.type !== 'closed';

  const toggleNav = () => {
    // TODO: DOM을 직접 건들이지 않고 스크롤 방지 구현
    const main = document.querySelector('main') as HTMLElement;

    if (isOpen) {
      // 닫기: main style 초기화
      main.style.overflow = '';
      main.style.height = '';
      closeNavbar();
    } else {
      // 열기: 스크롤 방지 + 해당 카테고리 선택
      main.scrollTo(0, 0);
      main.style.overflow = 'hidden';
      main.style.height = '100%';

      const itemToOpen = topLevelNavItem || navigationTree[0]; // 기본값: 첫 번째 카테고리
      hoverNavItem(itemToOpen);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleNav}
      className="flex sm:hidden"
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
    >
      {isOpen ? (
        <span className="material-symbols-rounded text-white">close</span>
      ) : (
        <MenuSVG />
      )}
    </Button>
  );
}
