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

export interface FieldsetProps {
  title: string;
  titleSpacing?: TitleSpacing;
  children: ReactNode;
  spacing?: Spacing;
  required?: boolean;
  grow?: boolean;
  hidden?: boolean;
  className?: string;
}

function Fieldset({
  title,
  titleSpacing = '2',
  children,
  spacing,
  required = false,
  grow = true,
  hidden = false,
  className,
}: FieldsetProps) {
  return (
    <fieldset
      className={clsx(
        'flex flex-col',
        spacing && SPACING_MAP[spacing],
        grow && 'flex-1',
        hidden && 'hidden',
        className,
      )}
    >
      <legend
        className={clsx(
          'text-md font-medium tracking-wide',
          TITLE_SPACING_MAP[titleSpacing],
        )}
      >
        {title}
        {required && <span className="text-main-orange">*</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function HTML({ children }: { children: ReactNode }) {
  return (
    <Fieldset title="내용" spacing="6" titleSpacing="2" required>
      {children}
    </Fieldset>
  );
}

function Image({ children }: { children: ReactNode }) {
  return (
    <Fieldset title="사진" spacing="12" titleSpacing="2">
      {children}
    </Fieldset>
  );
}

function File({ children }: { children: ReactNode }) {
  return (
    <Fieldset title="첨부파일" spacing="6" titleSpacing="3">
      {children}
    </Fieldset>
  );
}

function Title({ children }: { children: ReactNode }) {
  return (
    <Fieldset title="제목" spacing="6" titleSpacing="2" required>
      {children}
    </Fieldset>
  );
}

export default Object.assign(Fieldset, { HTML, Image, File, Title });
