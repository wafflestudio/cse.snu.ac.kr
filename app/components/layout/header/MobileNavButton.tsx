import { useStore } from '~/store';
import MenuSVG from './assets/menu.svg?react';

export default function MobileNavButton() {
  const navbarState = useStore((s) => s.navbarState);
  const expandNavbar = useStore((s) => s.expandNavbar);
  const closeNavbar = useStore((s) => s.closeNavbar);

  const isOpen = navbarState.type !== 'closed';

  const toggleNav = () => {
    if (isOpen) {
      closeNavbar();
    } else {
      expandNavbar();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleNav}
      className="flex sm:hidden"
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
    >
      {isOpen ? (
        <span className="material-symbols-rounded text-white">close</span>
      ) : (
        <MenuSVG />
      )}
    </button>
  );
}
