import { X } from 'lucide-react';
import type { ReactNode } from 'react';

// d1baf83c 의 apps/web/src/components/ui/Dialog.tsx 판을 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 문서 안에 나란히 놓으려고 화면 위에 띄우는 Radix 포털·가림막·위치(fixed)는 빼고 판만 그린다.
// 예전 판: 연회색 바탕, 위 주황 3px + 아래 주황 1px, 그림자 없음, 제목은 내용이 직접 그렸다.
export default function LegacyDialogPanel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative w-full overflow-auto border-t-3 border-b border-main-orange bg-neutral-50 p-6">
      <button
        type="button"
        aria-label="닫기"
        className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700"
      >
        <X className="h-6 w-6" />
      </button>
      {children}
    </div>
  );
}
