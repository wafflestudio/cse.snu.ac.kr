import type { ReactNode } from 'react';

// d1baf83c 의 apps/web/src/components/form/Section.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 예전 폼 그룹 제목: 14px semibold, 넓은 자간, 제목 아래 12(titleSpacing 3).
export function LegacySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 text-md font-semibold tracking-wide">{title}</div>
      {children}
    </section>
  );
}
