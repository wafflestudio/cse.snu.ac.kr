import { Link } from '@tanstack/react-router';
import SmallRightArrowIcon from '@/components/ui/assets/small_right_arrow.svg?react';
import { useLanguage } from '@/hooks/useLanguage';
import type { MainNews } from '@/types/api';
import NewsCarousel from './NewsCarousel';
import NewsCarouselMobile from './NewsCarouselMobile';

export default function NewsSection({ mainNews }: { mainNews: MainNews[] }) {
  const { t, localizedPath } = useLanguage();

  return (
    <div className="relative flex flex-col gap-6.5 overflow-hidden bg-neutral-100 pb-12 pl-5 pt-8 sm:flex-row sm:gap-[60px] sm:py-10 sm:pl-[60px] sm:pr-[150px] sm:pt-[72px]">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-neutral-800 sm:text-3xl sm:font-medium">
          {t('새 소식')}
        </h3>
        <Link
          className="hidden items-center gap-1 text-base font-normal text-main-orange-muted sm:flex"
          to={localizedPath('/community/news')}
        >
          {t('더보기')} <SmallRightArrowIcon />
        </Link>
      </div>
      {/* useIsMobile 로 고르면 SSR 이 모바일판을 그려 데스크톱에서 교체되며 64px 밀린다.
          CSS 로 감추면 서버가 그린 마크업이 곧 최종 레이아웃이라 이동이 없다.
          래퍼는 `contents` 라 레이아웃에 없다 — 캐러셀이 그대로 flex 자식으로 남는다. */}
      <div className="contents sm:hidden">
        <NewsCarouselMobile news={mainNews} />
      </div>
      <div className="hidden sm:contents">
        <NewsCarousel news={mainNews} />
      </div>
    </div>
  );
}
