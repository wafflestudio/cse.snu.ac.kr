import type { ReactNode } from 'react';

export function Callout({ children }: { children?: ReactNode }) {
  return (
    <div className="max-w-[560px] border-l-[3px] border-main-orange bg-neutral-50 px-4.5 py-3 [&>p]:mt-0 [&>p]:text-neutral-700">
      {children}
    </div>
  );
}
