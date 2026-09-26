import type { ReactNode } from 'react';

// 목록이 비었을 때 목록 자리에 두는 한 줄(/design-system#list). 문장은 짧게.
export default function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="border-y border-neutral-200 py-16 text-center type-body text-neutral-500">
      {children}
    </p>
  );
}
