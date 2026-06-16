import clsx from 'clsx';
import type { ReactNode } from 'react';

type Tone = 'white' | 'neutral';
type Padding = 'default' | 'subNav' | 'overviewTop' | 'overviewBottom';

interface ContentSectionProps {
  tone: Tone;
  padding: Padding;
  children: ReactNode;
}

const TONE_CLASSES: Record<Tone, string> = {
  white: 'bg-white',
  neutral: 'bg-neutral-100',
};

// 가로 거터는 page-gutter-x(단일 출처), 세로 패딩만 프리셋별로.
const PADDING_CLASSES: Record<Padding, string> = {
  default: 'page-gutter-x pb-12 pt-7 sm:py-11',
  subNav: 'page-gutter-x pb-12 pt-7 sm:pt-11 sm:pb-[150px]',
  overviewTop: 'page-gutter-x pb-12 pt-7 sm:py-11',
  overviewBottom: 'page-gutter-x pb-16 pt-10 sm:pb-[7.88rem]',
};

export default function ContentSection({
  tone,
  padding,
  children,
}: ContentSectionProps) {
  return (
    <section className={clsx(TONE_CLASSES[tone], PADDING_CLASSES[padding])}>
      {children}
    </section>
  );
}
