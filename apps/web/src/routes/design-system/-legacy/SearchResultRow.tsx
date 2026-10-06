import { stay } from '../-components/sample';
import { LegacyTag } from './Tag';

// d1baf83c 의 apps/web/src/routes/$locale/search/-components/ui/SearchResultRow.tsx(와 HighlightedText.tsx)를
// 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다). 통합 검색 결과 한 줄.
// 행 전체 링크는 이동하지 않는 <a href="#"> 로, 종류 배지·날짜는 글자 그대로 받는다. 사진은 없는 경우만.
// 예전 값: 줄 안 간격 10px(gap-[.62rem]), 아래 선 없음.

interface LegacySearchItem {
  title: string;
  preview: { text: string; hit: boolean }[];
  type: string;
  date: string;
}

export function LegacySearchResultRow({ item }: { item: LegacySearchItem }) {
  return (
    <article>
      <a href="#" onClick={stay} className="group flex gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-[.62rem]">
          <span className="text-base font-bold leading-snug tracking-wide text-neutral-950 group-hover:underline">
            {item.title}
          </span>

          <p className="line-clamp-2 text-md font-normal leading-normal text-neutral-700">
            {item.preview.map((segment) =>
              segment.hit ? (
                <span
                  key={`${segment.text}-hit`}
                  className="font-semibold text-neutral-950"
                >
                  {segment.text}
                </span>
              ) : (
                <span key={segment.text}>{segment.text}</span>
              ),
            )}
          </p>

          <div className="flex items-center gap-2.5">
            <LegacyTag label={item.type} />
            <time className="text-md font-medium leading-none tracking-wide text-neutral-500">
              {item.date}
            </time>
          </div>
        </div>
      </a>
    </article>
  );
}
