import { Link, useLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import Node from '@/components/ui/Nodes';
import { useLanguage } from '@/hooks/useLanguage';
import type { SubNavConfig, SubNavConfigItem } from '@/hooks/useSubNav';

export default function SubNavbar({
  title,
  titlePath,
  items,
  localized = true,
}: SubNavConfig) {
  const { localizedPath } = useLanguage();
  const toPath = (path: string) => (localized ? localizedPath(path) : path);

  return (
    // 왼쪽 끝을 본문 끝(오른쪽 360 자리의 시작) + 64 에 고정한다. 오른쪽 끝에 붙이면 폭이 굵은 현재
    // 항목 글자에 따라 바뀌어 형제 페이지를 오갈 때 좌우로 튄다. 가장 긴 목록(시설 예약, 274)도 들어간다.
    <div className="absolute top-0 left-[calc(100%-18.5rem)] hidden h-full xl:block">
      <div
        // 세로 곡선은 목록 높이에 맞춰 늘어난다(항목 수별 높이 표 없음).
        className="sticky top-[52px] col-start-2 row-span-full mb-8 mt-13 flex"
      >
        <Node variant="curvedVertical" />
        <div className="pl-1.5 pt-2.75">
          <Link
            to={toPath(titlePath)}
            className="text-neutral-950 hover:text-main-orange-dark"
          >
            <h3 className="inline whitespace-nowrap type-item">{title}</h3>
          </Link>
          <ul className="mt-4">
            {items.map((item, index) => (
              <SubNavItem
                key={`${item.path}-${index}`}
                item={item}
                toPath={toPath}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const marginLeftMap = ['ml-0', 'ml-4', 'ml-8'];

function SubNavItem({
  item,
  toPath,
}: {
  item: SubNavConfigItem;
  toPath: (path: string) => string;
}) {
  const { pathname } = useLocation();
  const localizedItemPath = item.path ? toPath(item.path) : undefined;
  const isCurrent =
    localizedItemPath !== undefined && pathname.startsWith(localizedItemPath);
  const marginLeft = marginLeftMap[item.depth || 0];

  return (
    <li
      className={clsx(
        'mb-3.5 w-fit type-ui',
        marginLeft,
        isCurrent
          ? 'font-bold tracking-wider text-main-orange'
          : 'text-neutral-700',
      )}
    >
      {localizedItemPath ? (
        <Link
          to={localizedItemPath}
          className="whitespace-nowrap hover:text-main-orange-dark"
        >
          <NavLabel text={item.name} />
        </Link>
      ) : (
        <span className={'whitespace-nowrap'}>
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
      <span className="type-meta">{text.slice(idx)}</span>
    </>
  );
}
