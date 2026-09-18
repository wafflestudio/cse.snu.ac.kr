import { Link, useSearch } from '@tanstack/react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Image from '@/components/ui/Image';
import { Tag } from '@/components/ui/Tag';
import { useLanguage } from '@/hooks/useLanguage';
import type { NewsPreview } from '@/types/api';

interface NewsListRowProps {
  post: NewsPreview;
}

export default function NewsListRow({ post }: NewsListRowProps) {
  const { t, locale, localizedPath, tUnsafe } = useLanguage({
    조회수: 'Views',
  });
  const search = useSearch({ strict: false });

  const detailPathBase = localizedPath(`/community/news/${post.id}`);
  const pageNum = search.pageNum;
  const detailPath = pageNum
    ? `${detailPathBase}?pageNum=${pageNum}`
    : detailPathBase;

  return (
    <article className="flex flex-col-reverse gap-4 border-b border-neutral-100 pb-5 sm:flex-row sm:gap-8">
      <div className="flex flex-1 flex-col justify-between break-keep">
        <p className="mb-2.5 mt-5 flex items-center gap-2.5 text-md text-neutral-800 sm:hidden">
          <time>
            {dayjs(post.date).locale(locale).format('YYYY/M/DD (ddd)')}
          </time>
          {/* 조회 때마다 늘어 정규화가 안 된다 — E2E 가 마스킹하는 지점. */}
          <span data-testid="view-count">
            {t('조회수')} {post.viewCount.toLocaleString()}
          </span>
        </p>

        <div className="flex flex-col items-start">
          <Link to={detailPath} className="hover:underline">
            <h3 className="mb-2.5 text-base font-medium">{post.title}</h3>
          </Link>

          <Link
            to={detailPath}
            className="mb-3 line-clamp-3 break-all text-md font-normal leading-normal text-neutral-500 hover:cursor-pointer sm:mb-8"
          >
            {post.description}...
          </Link>
        </div>

        <div className="flex items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            {(post.tags ?? []).map((tag) => (
              <Tag
                key={tag}
                label={tUnsafe(tag)}
                href={localizedPath(`/community/news?tag=${tag}`)}
              />
            ))}
          </div>
          <p className="hidden items-center gap-2.5 self-end whitespace-nowrap text-sm leading-loose text-neutral-800 sm:flex">
            <time>
              {dayjs(post.date).locale(locale).format('YYYY/M/DD (ddd)')}
            </time>
            {/* 조회 때마다 늘어 정규화가 안 된다 — E2E 가 마스킹하는 지점. */}
            <span data-testid="view-count">
              {t('조회수')} {post.viewCount.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {post.imageURL ? (
        <Link to={detailPath} className="relative flex aspect-4/3 sm:h-37.5">
          <Image
            src={post.imageURL}
            alt="포스트 대표 이미지"
            // 모바일은 본문 폭을 꽉 채우고 데스크톱은 200px 고정(sm:w-50 폴백과 같은 값).
            sizes="(min-width: 640px) 200px, 100vw"
            className="h-full w-full object-cover"
          />
        </Link>
      ) : (
        <div className="hidden sm:block sm:h-37.5 sm:w-50 sm:bg-neutral-100" />
      )}
    </article>
  );
}
