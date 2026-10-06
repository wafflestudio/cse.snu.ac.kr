import type { ReactNode } from 'react';

// d1baf83c 의 apps/web/src/components/form/Fieldset.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 예전 폼 필드 제목(14px medium, 넓은 자간, 필수 표시는 주황 *). 견본에 쓰는 기본 모양(spacing 6, grow)만 옮겼다.
export default function LegacyFieldset({
  title,
  children,
  required = false,
}: {
  title: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <fieldset className="mb-6 flex flex-1 flex-col">
      <legend className="mb-2 text-md font-medium tracking-wide">
        {title}
        {required && <span className="text-main-orange">*</span>}
      </legend>
      {children}
    </fieldset>
  );
}
