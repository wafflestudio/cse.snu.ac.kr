import type { ReactNode } from 'react';

export default function PeopleBulletRow({ children }: { children: ReactNode }) {
  return (
    // 줄이 넘어가도 점은 첫 줄 옆 — 점 칸 높이를 한 줄 높이(1.5em)로 둔다(/design-system#unique).
    <li className="flex items-start gap-2 px-2 type-body leading-normal">
      <span className="flex h-[1.5em] shrink-0 items-center">
        <span className="size-[3px] rounded-full bg-neutral-950" />
      </span>
      <p>{children}</p>
    </li>
  );
}
