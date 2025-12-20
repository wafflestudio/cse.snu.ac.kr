import clsx from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import navbarTranslations from '~/components/layout/LeftNav/translations.json';
import type { NavItem } from '~/constants/navigation';
import { useLanguage } from '~/hooks/useLanguage';

interface CategoryGridProps {
  currentPage: NavItem | null;
  theme: 'light' | 'dark';
}

const ROOT_GRID_CLASS =
  'mb-5 grid grid-cols-[repeat(2,1fr)] gap-9 sm:mb-10 sm:grid-cols-[repeat(auto-fill,300px)] sm:gap-9';
const LEAF_GRID_CLASS =
  'grid grid-cols-[repeat(2,1fr)] gap-5 sm:mb-10 sm:grid-cols-[repeat(auto-fill,300px)] sm:gap-10';

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
      navigate(localizedPath(item.path));
      return;
    }
    setSelectedCategory(item);
  };

  return (
    <div
      className={clsx(
        isLight ? 'bg-white' : 'bg-neutral-900',
        'px-5 py-7 sm:px-25 sm:pb-45 sm:pt-20',
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
                subpage.path && navigate(localizedPath(subpage.path))
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
      bgColor: 'bg-main-orange-dark',
      hoverColor: 'bg-main-orange-dark',
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
    hoverColor: 'bg-main-orange-dark',
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
    : 'hover:bg-main-orange-dark';
  const englishLabel =
    navbarTranslations[title as keyof typeof navbarTranslations] ?? '';

  return (
    <button
      type="button"
      className={clsx(
        'group flex h-[96px] cursor-pointer flex-col justify-between px-[14px] py-[13px] duration-300 sm:h-[160px] sm:px-7 sm:py-6',
        bgColor,
        hoverBgColor,
        borderColor && `border ${borderColor}`,
      )}
      onClick={onClick}
    >
      <div>
        <h3 className="mb-2.5 text-md font-medium text-neutral-800 sm:mb-2.5 sm:text-[20px] text-start">
          {title}
        </h3>
        <p className="text-[11px] text-neutral-800 sm:text-base text-start">
          {englishLabel}
        </p>
      </div>
      {hasArrow && (
        <div className="text-end">
          <span className="material-symbols-outlined text-[18px] font-extralight text-neutral-800 duration-300 group-hover:translate-x-[10px] sm:text-[32px]">
            arrow_forward
          </span>
        </div>
      )}
    </button>
  );
}
