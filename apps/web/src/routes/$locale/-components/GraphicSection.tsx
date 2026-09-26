import type { ReactNode } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import MainGraphic from './MainGraphic';

// 슬로건 네 줄. 첫 줄은 데스크톱에서만(모바일은 세 줄). 글꼴 subset 은 한국어 슬로건 글자 + ASCII 라
// 영어도 같은 글꼴로 그려진다(app.css 의 subset 명령).
const SLOGAN = {
  ko: [
    '서울대학교 컴퓨터공학부는',
    '창의와 지식을 융합하여',
    '컴퓨터 기술의',
    '진화를 선도합니다.',
  ],
  // 모바일은 첫 줄을 빼고 셋만 보인다 — 빠져도 문장이 되고(첫 글자는 모바일에서 대문자로), 한 줄이
  // 모바일 폭(약 24자)에 들어가게 골랐다.
  en: [
    'At SNU Computer Science and Engineering,',
    'creativity and knowledge',
    'converge to lead',
    'the future of computing.',
  ],
} as const;

export default function GraphicSection() {
  const { locale } = useLanguage();
  const [first, ...rest] = SLOGAN[locale];
  return (
    <div className="relative flex w-fit min-w-full flex-col items-center justify-between gap-12 pb-16 pt-16 sm:flex-row-reverse sm:justify-center sm:gap-10 sm:pb-32 sm:pt-16 xl:gap-32">
      <div className="bg-pattern absolute inset-0 sm:hidden" />
      <MainGraphic className="z-10 h-50 w-[80%] sm:w-90 xl:mr-12 xl:w-104" />
      <div className="flex -translate-y-1 flex-col items-center gap-4 sm:h-50 sm:shrink-0 sm:items-start sm:justify-between">
        <SloganP className="hidden sm:block">{first}</SloganP>
        {rest.map((line, i) => (
          <SloganP
            key={line}
            className={i === 0 ? 'max-sm:first-letter:uppercase' : ''}
          >
            {line}
          </SloganP>
        ))}
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
  // 폭을 넘는 줄은 잘리지 않고 가운데 정렬로 줄을 바꾼다(모바일).
  <p
    className={`max-w-[calc(100vw-2.5rem)] text-center font-[Gowun_Batang] text-[1.8rem] text-white sm:max-w-none sm:text-left ${className}`}
  >
    {children}
  </p>
);
