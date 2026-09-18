import type { ReactNode } from 'react';

export function Intro({ children }: { children?: ReactNode }) {
  return (
    <section className="-mr-[var(--docs-gutter-end)] -ml-[var(--docs-gutter-start)] bg-neutral-100 pr-[var(--docs-gutter-end)] pl-[var(--docs-gutter-start)] py-11 text-md/[1.85] break-keep text-neutral-600 max-sm:py-8 [&>h2]:mt-0 [&>h2]:mx-0 [&>h2]:border-t-0 [&>h2]:px-0 [&>h2]:pt-0 [&>h2]:max-w-[560px] [&>p]:max-w-[560px] [&>p]:mt-4">
      {children}
    </section>
  );
}
