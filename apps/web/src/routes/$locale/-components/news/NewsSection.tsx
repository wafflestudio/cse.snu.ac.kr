import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { MainNews } from '@/types/api';
import NewsCarousel from './NewsCarousel';
import NewsCarouselMobile from './NewsCarouselMobile';

export default function NewsSection({ mainNews }: { mainNews: MainNews[] }) {
  const { t, localizedPath } = useLanguage();

  return (
    <div className="relative flex flex-col gap-6.5 overflow-hidden bg-neutral-100 page-band-start pb-12 pt-8 sm:flex-row sm:gap-15 sm:py-10 sm:pr-37.5 sm:pt-18">
      {/* 캐러셀이 고정폭이라 `shrink-0` 이 없으면 제목 칸이 34px 까지 눌려 「새 소식」이
          석 줄로 접힌다. 캐러셀은 `overflow-hidden` 안에서 오른쪽으로 흘러나가는 게 제 모양이다. */}
      <div className="flex shrink-0 flex-col gap-2">
        <h3 className="text-xl font-bold text-neutral-800 sm:text-3xl sm:font-medium">
          {t('새 소식')}
        </h3>
        <Link
          className="hidden items-center gap-1 text-base font-normal text-main-orange-muted sm:flex"
          to={localizedPath('/community/news')}
        >
          {t('더보기')}{' '}
          <ArrowRight className="size-4 shrink-0 text-main-orange-muted" />
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
