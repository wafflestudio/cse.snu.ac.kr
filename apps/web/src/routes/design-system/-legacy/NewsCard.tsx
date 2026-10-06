import Image from '@/components/ui/Image';
import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/routes/$locale/-components/news/NewsCard.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 메인 새 소식 캐러셀의 카드. 라우터 링크는 이동하지 않는 <a href="#"> 로, 날짜는 글자 그대로 받는다.
// 예전 값: 바탕 neutral-50 + 그림자(0 0 31.9px 7%), 제목 15·600, 안쪽 여백 14px.

interface LegacyMainNews {
  title: string;
  date: string;
  description: string;
}

export function LegacyNewsCard({ news }: { news: LegacyMainNews }) {
  return (
    <a
      href="#"
      onClick={stay}
      className="flex h-76 w-[13.8rem] shrink-0 flex-col bg-neutral-50 shadow-[0_0_31.9px_0_rgba(0,0,0,0.07)]"
    >
      <div className="relative h-25 w-full">
        <Image
          src={null}
          alt=""
          sizes="240px"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="px-[0.87rem] pt-[0.88rem]">
        <h3 className="line-clamp-2 text-[0.9375rem] font-semibold text-neutral-900">
          {news.title}
        </h3>
        <time className="mt-3 block text-sm font-normal text-neutral-500">
          {news.date}
        </time>
        <p className="mt-3 line-clamp-4 text-sm font-normal leading-[150%] text-neutral-500">
          {news.description}
        </p>
      </div>
    </a>
  );
}
