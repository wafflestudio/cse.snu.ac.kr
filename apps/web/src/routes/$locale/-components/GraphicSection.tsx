import type { ReactNode } from 'react';
import MainGraphic from '@/components/ui/MainGraphic';
import downArrowUrl from '../assets/down_arrow.svg?url';

export default function GraphicSection() {
  return (
    <div className="relative flex w-fit min-w-full flex-col items-center justify-between gap-[50px] pb-[67px] pt-[60px] sm:flex-row-reverse sm:justify-center sm:gap-[75px] sm:pb-[170px] sm:pt-[80px] xl:gap-[125px]">
      <div className="bg-pattern absolute inset-0 sm:hidden" />
      <img
        src={downArrowUrl}
        alt=""
        width={33}
        height={34}
        className="bottom-20 left-1/2 hidden -translate-x-1/2 animate-arrowBounce sm:absolute"
      />
      <MainGraphic className="z-10 h-50 w-[80%] sm:mr-[26px] sm:w-104 xl:mr-[52px]" />
      <div className="flex -translate-y-1 flex-col items-center gap-[18px] sm:h-50 sm:shrink-0 sm:items-start sm:justify-between">
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
