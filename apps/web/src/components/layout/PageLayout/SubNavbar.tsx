import { Link, useLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import Node from '@/components/ui/Nodes';
import { useLanguage } from '@/hooks/useLanguage';
import type { SubNavConfig, SubNavConfigItem } from '@/hooks/useSubNav';

export default function SubNavbar({ title, titlePath, items }: SubNavConfig) {
  const { localizedPath } = useLanguage();

  // 본문이 1200px 에서 멈추면 서브내비도 거기 붙어 따라온다 — 화면 끝을 기준으로 두면 넓은
  // 화면에서 본문과 1000px 가까이 벌어진다. 식은 `.page-gutter-x` 의 오른쪽 패딩과 한 쌍이다.
  // 25 = 화면 마진(헤더·푸터와 같은 선에서 끝나야 한다), 415 = 25 + 본문 300 + 서브내비 자리 90.
  const anchor =
    'right-[max(calc(var(--spacing)*25),calc((100%-calc(var(--spacing)*415))/2+var(--spacing)*25))]';

  // 자리(360)에서 화면 마진 100 을 빼고 본문과 24 를 띄운 값이 236(max-w-59)이다. 상한이 없으면
  // 라벨이 긴 페이지(예약)에서 서브내비가 자리를 꽉 채워 본문 글자에 닿는다.
  return (
    <div className={`absolute top-0 hidden h-full max-w-59 xl:block ${anchor}`}>
      <div
        // 높이를 항목 수 × 33 으로 적어두면 라벨이 접히는 순간 세로선이 목록보다 짧아진다.
        // 내용이 높이를 정하게 두고, 선이 목록 아래로 더 내려가는 만큼만 패딩으로 준다.
        className="sticky top-[52px] col-start-2 row-span-full mt-13 mb-8 flex pb-8"
      >
        {/* `Node` 안쪽이 `h-full` 이라 부모 높이가 auto 면 선이 안 자란다 — 늘어나는 래퍼를
            끼워 높이를 확정한다. */}
        <div className="self-stretch">
          <Node variant="curvedVertical" />
        </div>
        <div className="pl-1.5 pt-2.75">
          <Link
            to={localizedPath(titlePath)}
            className="text-neutral-800 hover:text-main-orange"
          >
            <h3 className="inline text-base font-bold">{title}</h3>
          </Link>
          <ul className="mt-4">
            {items.map((item, index) => (
              <SubNavItem key={`${item.path}-${index}`} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const marginLeftMap = ['ml-0', 'ml-4', 'ml-8'];

function SubNavItem({ item }: { item: SubNavConfigItem }) {
  const { localizedPath } = useLanguage();
  const { pathname } = useLocation();
  const localizedItemPath = item.path ? localizedPath(item.path) : undefined;
  const isCurrent =
    localizedItemPath !== undefined && pathname.startsWith(localizedItemPath);
  const marginLeft = marginLeftMap[item.depth || 0];

  return (
    <li
      className={clsx(
        'mb-3.5 w-fit text-sm',
        marginLeft,
        isCurrent ? 'font-bold text-main-orange' : 'text-neutral-800',
      )}
    >
      {localizedItemPath ? (
        <Link to={localizedItemPath} className={'hover:text-main-orange'}>
          <NavLabel text={item.name} />
        </Link>
      ) : (
        <span>
          <NavLabel text={item.name} />
        </span>
      )}
    </li>
  );
}

function NavLabel({ text }: { text: string }) {
  const idx = text.indexOf('(');
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <span className="text-xs font-medium leading-5">{text.slice(idx)}</span>
    </>
  );
}
