import { Link } from '@tanstack/react-router';
import dayjs from 'dayjs';
import Image from '@/components/ui/Image';
import { useLanguage } from '@/hooks/useLanguage';
import type { MainNews } from '@/types/api';
import { CARD_WIDTH_TAILWIND } from './constants';

export default function NewsCard({ news }: { news: MainNews }) {
  const { localizedPath } = useLanguage();

  return (
    <Link
      to={localizedPath(`/community/news/${news.id}`)}
      // 회색 띠 위 흰 카드 — 그림자는 떠 있는 층에만.
      className={`flex h-76 shrink-0 flex-col bg-white ${CARD_WIDTH_TAILWIND}`}
    >
      <div className="relative h-25 w-full">
        <Image
          // imageURL이 null일 때 encodeURI(null)='null' 문자열이 되어 src="null" 404가
          // 났음 → null은 그대로 넘겨 Image의 플레이스홀더 폴백이 동작하게 한다.
          src={news.imageURL ? encodeURI(news.imageURL) : news.imageURL}
          alt=""
          sizes="240px"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="px-4 pt-4">
        <h3 className="line-clamp-2 type-item text-neutral-950">
          {news.title}
        </h3>
        <time className="mt-3 block type-meta text-neutral-500">
          {dayjs(news.createdAt).format('YYYY/M/DD')}
        </time>
        <p className="mt-3 line-clamp-4 type-meta leading-normal text-neutral-500">
          {news.description}
        </p>
      </div>
    </Link>
  );
}
