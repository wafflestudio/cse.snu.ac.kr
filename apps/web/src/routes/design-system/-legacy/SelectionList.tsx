import { Link } from '@tanstack/react-router';
import CornerFoldedRectangle from '@/components/ui/CornerFoldedRectangle';

// d1baf83c 의 apps/web/src/components/feature/selection/SelectionList.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서
// 가져오지 않는다). 탭 목록이 자기 위 여백(pt-7, 640 이상 pt-11)을 스스로 줬다. 예전 sm 은 640 이라
// min-[40rem]: 으로 옮겼고(지금 sm 은 1024), lg(1024)는 그대로다. 접힌 모서리 상자는 지금 부품과 값이 같아 그대로 쓴다.
// 탭 링크는 지금 문서 페이지로 가서(화면이 바뀌지 않는다) 커서·호버·초점만 예전 그대로다.

interface LegacySelectionItem {
  label: string;
  selected?: boolean;
}

export function LegacySelectionList({
  items,
  href,
}: {
  items: LegacySelectionItem[];
  href: string;
}) {
  return (
    <ul className="mb-6 grid grid-cols-2 gap-3 pt-7 min-[40rem]:mb-9 min-[40rem]:pt-11 lg:grid-cols-[repeat(auto-fit,minmax(236px,auto))]">
      {items.map((item) => (
        <LegacySelectionItem
          key={item.label}
          name={item.label}
          isSelected={Boolean(item.selected)}
          href={href}
        />
      ))}
    </ul>
  );
}

function LegacySelectionItem({
  name,
  isSelected,
  href,
}: {
  name: string;
  isSelected: boolean;
  href: string;
}) {
  const itemCommonStyle =
    'flex items-center justify-center w-full h-10 py-3 text-center text-[11px] min-[40rem]:text-sm lg:text-md tracking-wide';

  return (
    <li>
      {isSelected ? (
        <CornerFoldedRectangle
          colorTheme="orange"
          size="small"
          shadow="medium"
          width="w-full"
        >
          <span className={`${itemCommonStyle} font-medium text-neutral-50`}>
            {name}
          </span>
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
            className={`${itemCommonStyle} text-neutral-500 transition-all duration-300 hover:text-neutral-800`}
          >
            {name}
          </Link>
        </CornerFoldedRectangle>
      )}
    </li>
  );
}
