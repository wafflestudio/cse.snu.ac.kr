import { Link } from '@tanstack/react-router';
import dayjs from 'dayjs';
import Image from '@/components/ui/Image';
import { findNavItemByPath, navTrailTo } from '@/constants/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import type { SearchResultItem } from '@/types/api';
import HighlightedText from './HighlightedText';

/**
 * 결과 한 줄. 타입마다 컴포넌트를 나누지 않고 있는 부품만 조합한다 —
 * 사진이 있으면 왼쪽에, 날짜가 있으면 메타 줄에.
 *
 * 빵부스러기는 navigationTree 에서 url 로 역추적한다. 검색 전용 라벨 표를 두면
 * 메뉴 이름을 바꿨을 때 여기만 옛 이름으로 남는다.
 */
export default function SearchResultRow({ item }: { item: SearchResultItem }) {
  const { localizedPath, tUnsafe } = useLanguage();

  const navItem = findNavItemByPath(item.url);
  const trail = navItem ? (navTrailTo(navItem) ?? []) : [];
  const meta = [
    trail.map((node) => tUnsafe(node.key)).join(' › '),
    item.date && dayjs(item.date).format('YYYY/M/D'),
  ].filter(Boolean);

  return (
    <article className="flex flex-col gap-5 sm:flex-row sm:gap-6">
      {item.thumbnailUrl && (
        <Link
          to={localizedPath(item.url)}
          className="relative flex aspect-4/3 shrink-0 sm:h-[6.25rem]"
        >
          <Image
            alt=""
            src={item.thumbnailUrl}
            className="h-full w-full object-cover"
          />
        </Link>
      )}

      <div className="flex min-w-0 flex-col gap-[.62rem]">
        <Link
          to={localizedPath(item.url)}
          className="text-base font-bold leading-none text-neutral-950 hover:underline"
        >
          {item.title}
        </Link>

        <HighlightedText segments={item.preview} />

        {meta.length > 0 && (
          <p className="text-md font-medium leading-none text-main-orange">
            {meta.join(' · ')}
          </p>
        )}
      </div>
    </article>
  );
}
