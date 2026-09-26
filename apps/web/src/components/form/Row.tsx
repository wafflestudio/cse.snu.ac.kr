import clsx from 'clsx';
import type { ReactNode } from 'react';

// 필드 둘을 한 줄에(/design-system/form). 모바일은 세로로 쌓고, 데스크톱은 칸 사이 24.
// md: 두 칸 모두 md 폭(320)까지 — 전화·팩스처럼 짧은 값. full: 본문 폭을 반씩.
// 줄 전체 폭을 고정하지 않는다 — 고정하면 모바일에서 넘친다.
export default function Row({
  size = 'md',
  children,
}: {
  size?: 'md' | 'full';
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        'grid sm:gap-x-6',
        size === 'md'
          ? 'sm:grid-cols-[repeat(2,minmax(0,20rem))]'
          : 'sm:grid-cols-2',
      )}
    >
      {children}
    </div>
  );
}
