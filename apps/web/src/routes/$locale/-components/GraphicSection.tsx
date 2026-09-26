import type { ReactNode } from 'react';
import MainGraphic from './MainGraphic';

export default function GraphicSection() {
  return (
    <div className="relative flex w-fit min-w-full flex-col items-center justify-between gap-12 pb-16 pt-16 sm:flex-row-reverse sm:justify-center sm:gap-10 sm:pb-32 sm:pt-16 xl:gap-32">
      <div className="bg-pattern absolute inset-0 sm:hidden" />
      <MainGraphic className="z-10 h-50 w-[80%] sm:w-90 xl:mr-12 xl:w-104" />
      <div className="flex -translate-y-1 flex-col items-center gap-4 sm:h-50 sm:shrink-0 sm:items-start sm:justify-between">
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
