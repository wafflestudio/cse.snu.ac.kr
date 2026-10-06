import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

// d1baf83c 의 apps/web/src/components/feature/category/CategoryGrid.tsx(어두운 테마)를 옮긴 사본. DS 문서 전용
// (앱 코드에서 가져오지 않는다). 견본 칸에 들어가게 모바일 크기로 고정했다(sm: 값은 뺐다). 하위 카드 격자는 뺐다.
// 예전에는 펼친 카드와 호버가 같은 짙은 주황이었고, 펼치는 카드(경로 없음)에는 오른쪽 아래 기호가 없었다.
// 카드를 누르면 펼치는 카드만 펼침 상태가 되고 이동은 하지 않는다.

interface LegacyCategoryCard {
  title: string;
  hasArrow: boolean;
}

export function LegacyCategoryGrid({
  items,
  initialSelected,
}: {
  items: LegacyCategoryCard[];
  initialSelected?: string;
}) {
  const [selected, setSelected] = useState(initialSelected);

  return (
    <div className="w-full bg-neutral-900 px-5 py-7">
      <div className="grid grid-cols-[repeat(2,1fr)] gap-9">
        {items.map((item) => {
          const isSelected = selected === item.title;
          return (
            <LegacyCategoryItem
              key={item.title}
              title={item.title}
              hasArrow={item.hasArrow}
              bgColor={isSelected ? 'bg-main-orange-dark' : 'bg-neutral-100'}
              onClick={() => !item.hasArrow && setSelected(item.title)}
            />
          );
        })}
      </div>
    </div>
  );
}

function LegacyCategoryItem({
  title,
  hasArrow,
  bgColor,
  onClick,
}: {
  title: string;
  hasArrow: boolean;
  bgColor: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={clsx(
        'group flex h-[96px] cursor-pointer flex-col justify-between px-[14px] py-[13px] duration-300 hover:bg-main-orange-dark',
        bgColor,
      )}
      onClick={onClick}
    >
      <div>
        <h3 className="mb-2.5 text-start text-md font-medium text-neutral-800">
          {title}
        </h3>
      </div>
      {hasArrow && (
        <div className="text-end">
          <ArrowRight
            className="h-[18px] w-[18px] text-neutral-800 duration-300 group-hover:translate-x-[10px]"
            strokeWidth={1.5}
          />
        </div>
      )}
    </button>
  );
}
