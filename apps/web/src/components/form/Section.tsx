import clsx from 'clsx';
import type { ReactNode } from 'react';

type Spacing = '2.5' | '4' | '5' | '6' | '8' | '10' | '11' | '12';
type TitleSpacing = '1' | '2' | '3';

const SPACING_MAP: Record<Spacing, string> = {
  '2.5': 'mb-2.5',
  '4': 'mb-4',
  '5': 'mb-5',
  '6': 'mb-6',
  '8': 'mb-8',
  '10': 'mb-10',
  '11': 'mb-11',
  '12': 'mb-12',
};

const TITLE_SPACING_MAP: Record<TitleSpacing, string> = {
  '1': 'mb-1',
  '2': 'mb-2',
  '3': 'mb-3',
};

interface SectionProps {
  title: string;
  spacing?: Spacing;
  titleSpacing?: TitleSpacing;
  disabled?: boolean;
  hidden?: boolean;
  children: ReactNode;
}

export default function Section({
  title,
  spacing,
  titleSpacing = '3',
  disabled,
  hidden,
  children,
}: SectionProps) {
  return (
    <section
      className={clsx(
        spacing && SPACING_MAP[spacing],
        disabled && 'opacity-30',
        hidden && 'hidden',
      )}
    >
      <div
        className={clsx(
          'text-md font-semibold tracking-wide',
          TITLE_SPACING_MAP[titleSpacing],
        )}
      >
        {title}
      </div>
      {children}
    </section>
  );
}
