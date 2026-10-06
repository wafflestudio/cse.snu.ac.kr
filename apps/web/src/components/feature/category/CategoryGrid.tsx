import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import navbarTranslations from '@/components/layout/LeftNav/translations.json';
import type { NavItem } from '@/constants/navigation';
import { useLanguage } from '@/hooks/useLanguage';

interface CategoryGridProps {
  currentPage: NavItem | null;
}

// 카드 사이 모바일 24·데스크톱 32(/design-system/category). 펼친 하위 카드는 위 카드와 같은 간격을 두고
// 이어진다 — 아래 여백은 띠(pb 64/128)만 준다(격자에 mb 를 더하면 띠 아래가 규칙보다 커진다).
const ROOT_GRID_CLASS =
  'grid grid-cols-[repeat(2,minmax(0,1fr))] gap-6 sm:grid-cols-[repeat(auto-fill,300px)] sm:gap-8';
const LEAF_GRID_CLASS =
  'mt-6 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-6 sm:mt-8 sm:grid-cols-[repeat(auto-fill,300px)] sm:gap-8';

export default function CategoryGrid({ currentPage }: CategoryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<NavItem | null>(
    null,
  );
  const navigate = useNavigate();
  const { localizedPath, tUnsafe } = useLanguage(navbarTranslations);

  const children = currentPage?.children ?? [];

  if (children.length === 0) return null;

  const handleItemClick = (item: NavItem) => {
    if (item.path) {
      navigate({ to: localizedPath(item.path) });
      return;
    }
    setSelectedCategory(item);
  };

  return (
    <div className="surface-dark bg-neutral-900 px-5 pt-8 pb-16 sm:px-25 sm:pt-16 sm:pb-32">
      <div className={ROOT_GRID_CLASS}>
        {children.map((subpage) => {
          return (
            <CategoryItem
              key={subpage.path ?? subpage.key}
              title={tUnsafe(subpage.key)}
              tone={selectedCategory?.key === subpage.key ? 'selected' : 'root'}
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
              tone="leaf"
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

// 호버는 바탕이 한 단계 진해지고 화살표가 민다. 선택(하위를 펼친 카드)은 짙은 주황 + 흰 글자 —
// 호버와 선택이 같은 색이면 무엇을 골랐는지 구분되지 않는다(/design-system/category).
const TONE_CLASS = {
  root: 'bg-neutral-100 text-neutral-950 hover:bg-neutral-200',
  selected: 'bg-main-orange-dark text-white',
  leaf: 'bg-neutral-400 text-neutral-950 hover:bg-neutral-500',
} as const;

interface CategoryItemProps {
  title: string;
  hasArrow: boolean;
  tone: keyof typeof TONE_CLASS;
  onClick: () => void;
}

function CategoryItem({ title, hasArrow, tone, onClick }: CategoryItemProps) {
  const englishLabel =
    navbarTranslations[title as keyof typeof navbarTranslations] ?? '';

  return (
    <button
      type="button"
      className={clsx(
        'group flex h-24 cursor-pointer flex-col justify-between p-4 duration-300 sm:h-40 sm:p-6',
        TONE_CLASS[tone],
      )}
      onClick={onClick}
      aria-expanded={hasArrow ? undefined : tone === 'selected'}
    >
      <div>
        <h3 className="mb-2 type-item text-start">
          {withBreakBeforeParen(title)}
        </h3>
        <p className="type-body text-start">{englishLabel}</p>
      </div>
      {/* 이동 카드는 →, 하위 카드를 펼치는 카드는 ⌄(펼치면 ⌃) — 둘이 한눈에 구분된다. */}
      <div className="flex justify-end">
        {hasArrow ? (
          <ArrowRight className="size-5 duration-300 group-hover:translate-x-2.5 sm:size-8" />
        ) : tone === 'selected' ? (
          <ChevronUp className="size-5 sm:size-8" />
        ) : (
          <ChevronDown className="size-5 sm:size-8" />
        )}
      </div>
    </button>
  );
}

// "Participants(Professors)"처럼 띄어쓰기 없는 긴 제목은 괄호 앞에서만 줄을 바꾼다 —
// 어절 단위 줄바꿈이라 한 어절로 보고 카드 폭을 밀어낸다.
function withBreakBeforeParen(text: string) {
  const i = text.indexOf('(');
  if (i <= 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <wbr />
      {text.slice(i)}
    </>
  );
}
