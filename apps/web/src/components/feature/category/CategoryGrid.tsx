import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import navbarTranslations from '@/components/layout/LeftNav/translations.json';
import type { NavItem } from '@/constants/navigation';
import { useLanguage } from '@/hooks/useLanguage';

interface CategoryGridProps {
  currentPage: NavItem | null;
  theme: 'light' | 'dark';
}

const ROOT_GRID_CLASS =
  'mb-5 grid grid-cols-[repeat(2,1fr)] gap-8 sm:mb-10 sm:grid-cols-[repeat(auto-fill,300px)] sm:gap-8';
const LEAF_GRID_CLASS =
  'grid grid-cols-[repeat(2,1fr)] gap-5 sm:mb-10 sm:grid-cols-[repeat(auto-fill,300px)] sm:gap-8';

export default function CategoryGrid({
  currentPage,
  theme,
}: CategoryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<NavItem | null>(
    null,
  );
  const navigate = useNavigate();
  const { localizedPath, tUnsafe } = useLanguage(navbarTranslations);

  const children = currentPage?.children ?? [];
  const isLight = theme === 'light';

  if (children.length === 0) return null;

  const handleItemClick = (item: NavItem) => {
    if (item.path) {
      navigate({ to: localizedPath(item.path) });
      return;
    }
    setSelectedCategory(item);
  };

  return (
    <div
      className={clsx(
        isLight ? 'bg-white' : 'bg-neutral-900',
        'page-gutter-x page-end pt-7 sm:pt-20',
      )}
    >
      <div className={ROOT_GRID_CLASS}>
        {children.map((subpage) => {
          const { bgColor, hoverColor, borderColor } = getRootItemStyles(
            selectedCategory?.key === subpage.key,
            isLight,
          );

          return (
            <CategoryItem
              key={subpage.path ?? subpage.key}
              title={tUnsafe(subpage.key)}
              bgColor={bgColor}
              hoverColor={hoverColor}
              borderColor={borderColor}
              hasArrow={Boolean(subpage.path)}
              onClick={() => handleItemClick(subpage)}
            />
          );
        })}
      </div>

      {selectedCategory?.children && selectedCategory.children.length > 0 && (
        <div className={LEAF_GRID_CLASS}>
          {selectedCategory.children.map((subpage) => (
            <CategoryItem
              key={subpage.path ?? subpage.key}
              title={tUnsafe(subpage.key)}
              bgColor="bg-neutral-400"
              hoverColor="bg-neutral-500"
              hasArrow
              onClick={() =>
                subpage.path && navigate({ to: localizedPath(subpage.path) })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getRootItemStyles(isSelected: boolean, isLight: boolean) {
  if (isSelected) {
    return {
      bgColor: 'bg-main-orange-muted',
      hoverColor: 'bg-main-orange-muted',
      borderColor: undefined,
    };
  }

  if (isLight) {
    return {
      bgColor: 'bg-neutral-50',
      hoverColor: 'bg-neutral-200',
      borderColor: 'border-neutral-200',
    };
  }

  return {
    bgColor: 'bg-neutral-100',
    hoverColor: 'bg-main-orange-muted',
    borderColor: undefined,
  };
}

interface CategoryItemProps {
  title: string;
  hasArrow: boolean;
  bgColor: string;
  hoverColor?: string;
  borderColor?: string;
  onClick: () => void;
}

function CategoryItem({
  title,
  hasArrow,
  bgColor,
  hoverColor,
  borderColor,
  onClick,
}: CategoryItemProps) {
  const hoverBgColor = hoverColor
    ? `hover:${hoverColor}`
    : 'hover:bg-main-orange-muted';
  const englishLabel =
    navbarTranslations[title as keyof typeof navbarTranslations] ?? '';

  return (
    <button
      type="button"
      className={clsx(
        'group flex h-[96px] cursor-pointer flex-col justify-between px-3.5 py-3.25 duration-300 sm:h-[160px] sm:px-7 sm:py-6',
        bgColor,
        hoverBgColor,
        borderColor && `border ${borderColor}`,
      )}
      onClick={onClick}
    >
      <div>
        <h3 className="mb-2.5 text-md font-medium text-neutral-950 sm:mb-2.5 sm:text-xl text-start">
          {title}
        </h3>
        <p className="text-xs text-neutral-950 sm:text-base text-start">
          {englishLabel}
        </p>
      </div>
      {hasArrow && (
        <div className="text-end">
          <ArrowRight className="h-[18px] w-[18px] text-neutral-950 duration-300 group-hover:translate-x-[10px] sm:h-[32px] sm:w-[32px]" />
        </div>
      )}
    </button>
  );
}
