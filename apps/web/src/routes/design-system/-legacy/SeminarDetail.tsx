import type { ReactNode } from 'react';
import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/routes/$locale/community/seminar/$id.tsx 안 연사 줄과 LinkOrText 를 옮긴 사본.
// DS 문서 전용(앱 코드에서 가져오지 않는다). 연사를 "이름: / 직함: / 소속:" 줄로 나눴고,
// 링크는 밑줄 없이 색만, 호버 때만 밑줄이었다. 링크는 이동하지 않는 <a href="#"> 로 바꿨다.
// 예전 링크 색 --color-link 는 #3c7be4 였다(지금 토큰은 #2867cf).

export function LegacyLinkOrText({ children }: { children: ReactNode }) {
  return (
    <a href="#" onClick={stay} className="text-[#3c7be4] hover:underline">
      {children}
    </a>
  );
}

export function LegacySeminarSpeaker({
  name,
  title,
  affiliation,
}: {
  name: string;
  title: string;
  affiliation: string;
}) {
  return (
    <div className="flex flex-col gap-3 text-md">
      <div>
        이름: <LegacyLinkOrText>{name}</LegacyLinkOrText>
      </div>
      <p>직함: {title}</p>
      <div>
        소속: <LegacyLinkOrText>{affiliation}</LegacyLinkOrText>
      </div>
    </div>
  );
}
