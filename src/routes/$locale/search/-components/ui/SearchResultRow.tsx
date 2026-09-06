import { Link } from '@tanstack/react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Image from '@/components/ui/Image';
import { Tag } from '@/components/ui/Tag';
import { findNavItemByPath } from '@/constants/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import type { SearchResultItem } from '@/types/api';
import HighlightedText from './HighlightedText';

/**
 * 결과 한 줄. 타입마다 컴포넌트를 나누지 않고 있는 부품만 조합한다 —
 * 사진이 있으면 오른쪽에, 날짜가 있으면 배지 옆에.
 *
 * 종류 배지는 navigationTree 에서 url 로 찾은 메뉴 이름이다. 검색 전용 라벨 표를
 * 두면 메뉴 이름을 바꿨을 때 여기만 옛 이름으로 남는다.
 */
export default function SearchResultRow({ item }: { item: SearchResultItem }) {
  const { localizedPath, tUnsafe, locale } = useLanguage();
  const navItem = findNavItemByPath(item.url);

  return (
    <article>
      {/* 행 전체가 링크다 — 어디를 눌러도 가고, 호버하면 제목에 밑줄이 생긴다. */}
      <Link to={localizedPath(item.url)} className="group flex gap-6">
        {/* 사진을 오른쪽에 두면 사진이 있고 없고에 따라 제목이 좌우로 튀지 않는다. */}
        {item.thumbnailUrl && (
          <div className="relative order-last flex aspect-4/3 h-[6.25rem] shrink-0">
            <Image
              alt=""
              src={item.thumbnailUrl}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-[.62rem]">
          <span className="text-base font-bold leading-snug tracking-wide text-neutral-950 group-hover:underline">
            {item.title}
          </span>

          <HighlightedText segments={item.preview} />

          <div className="flex items-center gap-2.5">
            {navItem && <Tag label={tUnsafe(navItem.key)} />}
            {item.date && (
              <time className="text-md font-medium leading-none tracking-wide text-neutral-500">
                {formatDate(item.date, locale)}
              </time>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

// 새소식 상세와 같은 형식. 영어는 ddd요일이 "Tue요일"이 되므로 따로 쓴다.
function formatDate(iso: string, locale: string) {
  const date = dayjs(iso).locale(locale);
  return locale === 'en'
    ? date.format('MMM D, YYYY (ddd)')
    : date.format('YYYY년 M월 D일 ddd요일');
}
