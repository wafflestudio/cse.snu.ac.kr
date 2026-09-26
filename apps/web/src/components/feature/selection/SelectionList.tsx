import { Link } from '@tanstack/react-router';
import CornerFoldedRectangle from '@/components/ui/CornerFoldedRectangle';
import type { SelectionListItem } from '@/hooks/useSelectionList';

interface SelectionListProps {
  items: SelectionListItem[];
}

export default function SelectionList({ items }: SelectionListProps) {
  return (
    // auto-fill 이라 빈 칸 자리도 남는다 — 탭이 하나여도 한 칸 폭(데스크톱 본문 880 에서 약 285)이지
    // 본문 전체 막대로 늘어나지 않는다(auto-fit 은 남은 폭을 탭 하나에 몰아 준다).
    <ul className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-[repeat(auto-fill,minmax(236px,1fr))]">
      {items.map((item) => (
        <SelectionItem
          key={item.id}
          href={item.href}
          name={item.label}
          isSelected={Boolean(item.selected)}
        />
      ))}
    </ul>
  );
}

interface SelectionItemProps {
  name: string;
  isSelected: boolean;
  href: string;
}

function SelectionItem({ name, isSelected, href }: SelectionItemProps) {
  const itemCommonStyle =
    'flex items-center justify-center w-full h-10 py-3 text-center type-label tracking-wide';

  return (
    <li>
      {isSelected ? (
        <CornerFoldedRectangle
          colorTheme="orange"
          size="small"
          shadow="medium"
          width="w-full"
        >
          <span className={`${itemCommonStyle} text-neutral-50`}>{name}</span>
        </CornerFoldedRectangle>
      ) : (
        <CornerFoldedRectangle
          colorTheme="lightGray"
          size="small"
          shadow="medium"
          animationType="folding"
          width="w-full"
        >
          <Link
            to={href}
            resetScroll={false}
            className={`${itemCommonStyle} text-neutral-500 transition-all duration-300 hover:text-neutral-950`}
          >
            {name}
          </Link>
        </CornerFoldedRectangle>
      )}
    </li>
  );
}
