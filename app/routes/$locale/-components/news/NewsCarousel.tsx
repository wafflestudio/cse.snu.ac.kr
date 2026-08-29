import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import type { ButtonHTMLAttributes } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { MainNews } from '@/types/api/v2';
import PauseIcon from './assets/pause.svg?react';
import PlayIcon from './assets/play.svg?react';
import { AUTO_SCROLL_MS, CARD_GAP_TAILWIND } from './constants';
import NewsCard from './NewsCard';

// 뷰포트 너비 = 보이는 카드 수만큼. >1380px 4장 / ≤1380px 3장.
// 마지막 카드 끝을 0.05rem 잘라 "다음 페이지 있음"을 암시(기존 보정값 유지).
const VIEWPORT_WIDTH = 'w-[61.15rem] max-[1380px]:w-[45.35rem]';

export default function NewsCarousel({ news }: { news: MainNews[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      slidesToScroll: 4,
      containScroll: 'trimSnaps',
      // 페이지 단위(보이는 카드 수)로 스냅. 뷰포트 너비 변화와 동일 기준(1380px).
      breakpoints: { '(max-width: 1380px)': { slidesToScroll: 3 } },
    },
    [Autoplay({ delay: AUTO_SCROLL_MS, stopOnInteraction: false })],
  );

  const [page, setPage] = useState(0);
  const [pageCnt, setPageCnt] = useState(1);
  const [isScroll, setIsScroll] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;

    const syncSnaps = () => {
      setPageCnt(emblaApi.scrollSnapList().length);
      setPage(emblaApi.selectedScrollSnap());
    };
    // Autoplay는 내부 플래그를 바꾸기 직전에 이벤트를 emit하므로, 핸들러에서
    // isPlaying()을 재조회하면 갱신 전(반대) 값을 읽는다 → 이벤트별로 직접 설정.
    const onPlay = () => setIsScroll(true);
    const onStop = () => setIsScroll(false);

    syncSnaps();
    setIsScroll(emblaApi.plugins().autoplay?.isPlaying() ?? false);
    emblaApi
      .on('select', syncSnaps)
      .on('reInit', syncSnaps)
      .on('autoplay:play', onPlay)
      .on('autoplay:stop', onStop);

    return () => {
      emblaApi
        .off('select', syncSnaps)
        .off('reInit', syncSnaps)
        .off('autoplay:play', onPlay)
        .off('autoplay:stop', onStop);
    };
  }, [emblaApi]);

  const goToPage = useCallback(
    (idx: number) => emblaApi?.scrollTo(idx),
    [emblaApi],
  );

  const toggleScroll = useCallback(() => {
    const autoplay = emblaApi?.plugins().autoplay;
    if (!autoplay) return;
    if (autoplay.isPlaying()) {
      autoplay.stop();
    } else {
      autoplay.play();
    }
  }, [emblaApi]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={emblaRef}
        className={`mx-auto cursor-grab overflow-hidden pb-10 active:cursor-grabbing ${VIEWPORT_WIDTH}`}
      >
        <div className={`flex ${CARD_GAP_TAILWIND}`}>
          {news.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
      <PageIndicator
        page={page}
        pageCnt={pageCnt}
        setPage={goToPage}
        isScroll={isScroll}
        toggleScroll={toggleScroll}
      />
    </div>
  );
}

const PageIndicator = ({
  page,
  pageCnt,
  setPage,
  isScroll,
  toggleScroll,
}: {
  page: number;
  pageCnt: number;
  setPage: (page: number) => void;
  isScroll: boolean;
  toggleScroll: () => void;
}) => {
  return (
    <div className="relative flex">
      {[...Array(pageCnt).keys()].map((idx) => (
        <PageIndicatorDot
          key={idx}
          aria-label={`${idx + 1}번째 페이지로 이동`}
          isHighlight={page === idx}
          onClick={() => setPage(idx)}
        />
      ))}
      <button
        type="button"
        onClick={toggleScroll}
        aria-label={isScroll ? '자동 스크롤 중지' : '자동 스크롤 시작'}
      >
        {isScroll ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
};

const PageIndicatorDot = ({
  isHighlight,
  ...props
}: {
  isHighlight: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`flex h-6 items-center justify-center duration-700 ${
        isHighlight ? 'w-14' : 'w-6'
      }`}
      {...props}
    >
      <div
        className={`mx-2 h-2 w-full rounded-full ${
          isHighlight ? 'bg-[#E65615]' : 'bg-neutral-300'
        }`}
      />
    </button>
  );
};
