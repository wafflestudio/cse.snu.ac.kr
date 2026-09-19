import type { ReactNode } from 'react';

/**
 * 머리글에 이어 붙는 띠. 문서가 첫 블록에 주는 위 여백(`--docs-gap-top`)을 걷어내는데,
 * `data-bleed` 가 그 여백을 0 으로 만드는 규칙에서 자기를 빼는 표시다.
 */
export function Intro({ children }: { children?: ReactNode }) {
  return (
    <section
      data-bleed
      className="-mt-[var(--docs-gap-top)] -mr-[var(--docs-gutter-end)] -ml-[var(--docs-gutter-start)] bg-neutral-100 py-11 pr-[var(--docs-gutter-end)] pl-[var(--docs-gutter-start)] text-md/[1.85] break-keep text-neutral-600 max-sm:py-8 [&>h2]:mt-0 [&>h2]:max-w-[560px] [&>h2]:text-2xl/[1.4] [&>p]:mt-4 [&>p]:max-w-[560px] max-sm:[&>h2]:text-xl/[1.4]"
    >
      {children}
    </section>
  );
}
