import clsx from 'clsx';
import type { ReactNode } from 'react';

// 띠 틀의 띠 하나(/design-system/layout). PageLayout bands 안에 쌓는다.
// 위 32/48·아래 48, 마지막 띠만 아래 64/128(페이지 끝). 띠 안 마지막 요소의 아래 여백은 띠가 준다.
interface PageBandProps {
  tone?: 'white' | 'gray';
  children: ReactNode;
}

export default function PageBand({ tone = 'white', children }: PageBandProps) {
  return (
    <section
      className={clsx(
        tone === 'gray' ? 'bg-neutral-100' : 'bg-white',
        'page-gutter-x pt-8 pb-12 *:last:mb-0 last-of-type:pb-16 sm:pt-12 sm:last-of-type:pb-32',
      )}
    >
      {children}
    </section>
  );
}
