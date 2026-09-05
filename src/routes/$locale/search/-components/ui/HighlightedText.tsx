import type { SearchResultItem } from '@/types/api';

/**
 * 백엔드가 조각 배열로 준 미리보기를 그린다.
 *
 * 예전엔 문자열 하나와 정수 인덱스 둘(boldStart/boldEnd)을 받아 slice 했는데,
 * 강조가 한 군데뿐이고 여러 낱말로 검색하면 아예 사라졌다. ES 하이라이트는
 * 형태소·오타 매치도 짚어주므로 조각으로 받는 편이 표현력이 맞다.
 */
export default function HighlightedText({
  segments,
}: {
  segments: SearchResultItem['preview'];
}) {
  return (
    <p className="line-clamp-2 text-md font-normal leading-normal text-neutral-700">
      {segments.map((segment) =>
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
  );
}
