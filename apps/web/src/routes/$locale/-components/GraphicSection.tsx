import type { ReactNode } from 'react';
import MainGraphic from '@/components/ui/MainGraphic';

export default function GraphicSection() {
  return (
    <div className="page-band-x relative flex w-full flex-col items-center justify-between gap-12.5 pb-16.75 pt-15 sm:flex-row-reverse sm:justify-center sm:gap-18.75 sm:pb-42.5 sm:pt-20 xl:gap-31.25">
      <div className="bg-pattern absolute inset-0 sm:hidden" />
      {/* 자리가 모자라면 그래픽이 줄어든다 — 슬로건은 고정폭이라 안 줄고, 안 줄이면
          1024~1279 에서 행이 거터를 먹는다. */}
      <MainGraphic className="z-10 h-50 w-4/5 sm:mr-6.5 sm:w-auto sm:min-w-0 sm:max-w-104 sm:flex-1 xl:mr-13" />
      <div className="flex -translate-y-1 flex-col items-center gap-4.5 sm:h-50 sm:shrink-0 sm:items-start sm:justify-between">
        <SloganP className="hidden sm:block">서울대학교 컴퓨터공학부는</SloganP>
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
