import { Link } from '@tanstack/react-router';
import Node from '@/components/ui/Nodes';
import type { NavItem } from '@/constants/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import commonTranslations from '@/translations.json';
import leftNavTranslations from './translations.json';

const navbarTranslations = { ...commonTranslations, ...leftNavTranslations };

interface LNBMenuItemProps {
  navItem: NavItem;
  highlight: boolean;
  variant: 'sidebar' | 'detail';
  onHover?: () => void;
  onClick?: () => void;
}

export default function LNBMenuItem({
  navItem,
  highlight,
  variant,
  onHover,
  onClick,
}: LNBMenuItemProps) {
  const { localizedPath, tUnsafe } = useLanguage(navbarTranslations);

  // Build localized path if navItem has a path
  const to = navItem.path ? localizedPath(navItem.path) : undefined;

  // Translate and format label (inline NavLabel logic)
  const translated = tUnsafe(navItem.key);
  const idx = translated.indexOf('(');
  const label =
    idx === -1 ? (
      translated
    ) : (
      <>
        {translated.slice(0, idx)}
        <span className="type-caption">{translated.slice(idx)}</span>
      </>
    );

  if (variant === 'sidebar') {
    const color = highlight ? 'text-white' : 'text-neutral-500';
    const className = `type-ui ${color} cursor-pointer whitespace-nowrap`;

    return (
      <li
        className={className}
        onMouseEnter={onHover}
        onFocus={onHover}
        role="none"
      >
        {to ? (
          <Link
            to={to}
            className="block"
            role="menuitem"
            aria-current={highlight ? 'page' : undefined}
          >
            {label}
          </Link>
        ) : (
          <span className="block" aria-disabled="true">
            {label}
          </span>
        )}
      </li>
    );
  }

  // detail variant
  if (highlight && to) {
    return (
      <div className="flex items-center mb-6">
        <Link
          to={to}
          onClick={onClick}
          className="mr-4 h-4.25 shrink-0 type-ui text-main-orange"
          role="menuitem"
          aria-current="page"
        >
          {label}
        </Link>
        <Node variant="straight" />
      </div>
    );
  }

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="mb-6 block h-4.25 type-ui text-white hover:text-main-orange"
        role="menuitem"
      >
        {label}
      </Link>
    );
  }

  return (
    <p className="mb-6 block h-4.25 type-ui text-white" aria-disabled="true">
      {label}
    </p>
  );
}
