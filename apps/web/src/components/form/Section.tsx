import clsx from 'clsx';
import type { ReactNode } from 'react';

// 폼 묶음 사이 48(mb-12), 묶음 제목 아래 16(mb-4).

interface SectionProps {
  title: string;
  disabled?: boolean;
  hidden?: boolean;
  children: ReactNode;
}

export default function Section({
  title,
  disabled,
  hidden,
  children,
}: SectionProps) {
  return (
    <section
      className={clsx('mb-12', disabled && 'opacity-30', hidden && 'hidden')}
    >
      <div className="mb-4 type-item tracking-wide">{title}</div>
      {children}
    </section>
  );
}
