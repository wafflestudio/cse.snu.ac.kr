import clsx from 'clsx';
import type { ReactNode } from 'react';

// 필드 사이 24(mb-6), 필드명 아래 8(mb-2). 폼 간격은 이 둘뿐이다(/design-system#spacing).

interface FieldsetProps {
  title: string;
  children: ReactNode;
  required?: boolean;
  grow?: boolean;
  hidden?: boolean;
  className?: string;
}

function Fieldset({
  title,
  children,
  required = false,
  grow = true,
  hidden = false,
  className,
}: FieldsetProps) {
  return (
    <fieldset
      className={clsx(
        'flex flex-col',
        'mb-6',
        grow && 'flex-1',
        hidden && 'hidden',
        className,
      )}
    >
      <legend className="mb-2 type-label">
        {title}
        {required && <span className="text-main-orange">*</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function HTML({ children }: { children: ReactNode }) {
  return (
    <Fieldset title="내용" required>
      {children}
    </Fieldset>
  );
}

function Image({ children }: { children: ReactNode }) {
  return <Fieldset title="사진">{children}</Fieldset>;
}

function File({ children }: { children: ReactNode }) {
  return <Fieldset title="첨부파일">{children}</Fieldset>;
}

function Title({ children }: { children: ReactNode }) {
  return (
    <Fieldset title="제목" required>
      {children}
    </Fieldset>
  );
}

export default Object.assign(Fieldset, { HTML, Image, File, Title });
