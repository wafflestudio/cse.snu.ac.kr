import type { ReactNode } from 'react';
import MainGraphic from '@/components/ui/MainGraphic';

export default function GraphicSection() {
  return (
    // 가로 배치는 1280 부터다 — 1024 에서는 슬로건 281 + 그래픽 416 + 거터 200 이 본문 칸을 넘는다.
    // 그 아래는 모바일 히어로를 그대로 쓴다(가운데 정렬). 폭만 본문 칸을 따른다.
    <div className="page-band-x relative flex w-full flex-col items-center justify-between gap-12.5 pb-16.75 pt-15 xl:flex-row-reverse xl:items-center xl:justify-center xl:gap-31.25 xl:pb-42.5 xl:pt-20">
      <div className="bg-pattern absolute inset-0 sm:hidden" />
      <MainGraphic className="z-10 h-50 w-4/5 xl:mr-13 xl:w-104" />
      <div className="flex -translate-y-1 flex-col items-center gap-4.5 xl:h-50 xl:shrink-0 xl:justify-between">
        <SloganP className="hidden xl:block">서울대학교 컴퓨터공학부는</SloganP>
        <SloganP className="">창의와 지식을 융합하여</SloganP>
        <SloganP className="">컴퓨터 기술의</SloganP>
        <SloganP className="">진화를 선도합니다.</SloganP>
      </div>
    </div>
  );
}

const SloganP = ({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) => (
  <p className={`font-[Gowun_Batang] text-[1.8rem] text-white ${className}`}>
    {children}
  </p>
);
