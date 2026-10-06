import clsx from 'clsx';
import Node from '@/components/ui/Nodes';
import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/components/layout/PageLayout/SubNavbar.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서
// 가져오지 않는다). 견본 칸 안에 그리려고 바깥 absolute·sticky 자리와 항목 수별 높이 표는 뺐다.
// 라우터 링크는 이동하지 않는 <a href="#"> 로 바꿨고, 현재 항목은 current 로 넘긴다.
export function LegacySubNavbar({
  title,
  items,
  current,
}: {
  title: string;
  items: string[];
  current?: string;
}) {
  return (
    <div className="flex">
      <Node variant="curvedVertical" />
      <div className="pt-2.75 pl-1.5">
        <a
          href="#"
          onClick={stay}
          className="text-neutral-800 hover:text-main-orange"
        >
          <h3 className="inline whitespace-nowrap text-base font-semibold">
            {title}
          </h3>
        </a>
        <ul className="mt-4">
          {items.map((item) => (
            <li
              key={item}
              className={clsx(
                'mb-3.5 w-fit text-sm',
                item === current
                  ? 'font-bold tracking-wider text-main-orange'
                  : 'text-neutral-700',
              )}
            >
              <a
                href="#"
                onClick={stay}
                className="whitespace-nowrap hover:text-main-orange"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
