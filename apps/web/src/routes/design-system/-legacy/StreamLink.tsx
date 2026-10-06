import { useId } from 'react';
import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/routes/$locale/research/labs/$id/index.tsx 안 StreamLink(와 assets/pentagon_short.svg)를
// 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다). 연구실 상세의 "○○ 스트림" 링크로,
// 주황 테두리 오각형 상자에 호버하면 주황으로 채워진다. 라우터 링크는 누르면 이동하지 않는 <a>(onClick=stay) 로 바꿨고,
// 짧은 이름(10자 미만)용 오각형만 옮겼다.
export function LegacyStreamLink({ label }: { label: string }) {
  const maskId = useId();
  const d =
    'M160.086 0.585786C159.711 0.210713 159.202 0 158.672 0H2C0.895431 0 0 0.895431 0 2V38C0 39.1046 0.895435 40 2 40H172C173.105 40 174 39.1046 174 38V15.3284C174 14.798 173.789 14.2893 173.414 13.9142L160.086 0.585786Z';
  return (
    <div className="relative w-fit">
      <a
        href="/research/groups"
        onClick={stay}
        className="peer absolute flex h-10 w-[10.875rem] items-center justify-center pr-1 text-center text-sm duration-300 hover:text-white"
      >
        <span className="tracking-[-0.019em]">{label}</span>
      </a>
      <div className="text-white peer-hover:text-main-orange">
        <svg
          width="174"
          height="40"
          viewBox="0 0 174 40"
          fill="none"
          className="duration-300"
          aria-hidden="true"
        >
          <mask id={maskId} fill="white">
            <path fillRule="evenodd" clipRule="evenodd" d={d} />
          </mask>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={d}
            fill="currentColor"
          />
          <path
            d={d}
            stroke="#FF6914"
            strokeWidth="2"
            fill="none"
            mask={`url(#${maskId})`}
          />
        </svg>
      </div>
    </div>
  );
}
