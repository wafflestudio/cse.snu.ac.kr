import { Link } from '@tanstack/react-router';
import { IS_PROD } from '@/constants/api';
import { navigationTree } from '@/constants/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavItem } from '@/hooks/useNavItem';
import { useStore } from '@/store';
import DotEmpty from './assets/dot_empty.svg?react';
import DotFill from './assets/dot_fill.svg?react';
import LNBMenuItem from './LeftNavMenuItem';

export default function LNBSidebar() {
  const navbarState = useStore((s) => s.navbarState);
  const expandNavbar = useStore((s) => s.expandNavbar);
  const { pathWithoutLocale } = useLanguage();

  const isMain = pathWithoutLocale === '/';

  // Expand navbar if: hovered, explicitly expanded, or on main page
  const isExpanded = navbarState.type !== 'closed' || isMain;

  return (
    <nav
      className={`no-scrollbar z-50 flex flex-col items-center overflow-scroll bg-shell-100 py-12 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-44' : 'w-25'
      }`}
      onMouseEnter={expandNavbar}
      aria-label="주 네비게이션"
    >
      <Logo />
      {isExpanded ? <NavList /> : <DotList />}
    </nav>
  );
}

const logoTranslations = {
  '메인으로 이동': 'Go to home',
};

function Logo() {
  const { localizedPath, t } = useLanguage(logoTranslations);
  const homePath = localizedPath('/');

  return (
    <Link to={homePath} aria-label={t('메인으로 이동')} className="relative">
      <span
        className={`snu-logo block h-[58px] w-[56px] shrink-0 ${
          !IS_PROD ? 'bg-main-orange' : 'bg-white'
        }`}
      />
      {!IS_PROD && (
        <div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono font-bold">
          staging
        </div>
      )}
    </Link>
  );
}

function DotList() {
  const { activeItem } = useNavItem();

  const dotArr = navigationTree.map((item) => {
    if (!activeItem) return false;
    return activeItem.path?.startsWith(item.path || '') ?? false;
  });

  const getDotMargin = (filled: boolean, idx: number) => {
    if (dotArr[idx + 1]) return 'mb-9';
    return filled ? 'mb-9' : 'mb-11';
  };

  return (
    <div
      className={`flex flex-col items-center ${dotArr[0] ? 'mt-11' : 'mt-14'}`}
      role="presentation"
      aria-hidden="true"
    >
      {dotArr.map((filled, idx) =>
        filled ? (
          <DotFill
            key={idx}
            className={`text-white ${getDotMargin(filled, idx)}`}
          />
        ) : (
          <DotEmpty
            key={idx}
            className={`text-neutral-500 ${getDotMargin(filled, idx)}`}
          />
        ),
      )}
    </div>
  );
}

function NavList() {
  const navbarState = useStore((s) => s.navbarState);
  const { activeItem } = useNavItem();
  const hoverNavItem = useStore((s) => s.hoverNavItem);

  const shouldHighlight = (item: (typeof navigationTree)[0]) => {
    if (navbarState.type === 'hovered') {
      return item.key === navbarState.navItem.key;
    }
    return activeItem
      ? (item.path?.startsWith(activeItem.path || '') ?? false)
      : false;
  };

  return (
    <ul className="mx-12 mt-12 flex flex-col gap-9 text-center">
      {navigationTree.map((item, i) => (
        <LNBMenuItem
          key={i}
          navItem={item}
          highlight={shouldHighlight(item)}
          variant="sidebar"
          onHover={() => hoverNavItem(item)}
        />
      ))}
    </ul>
  );
}
