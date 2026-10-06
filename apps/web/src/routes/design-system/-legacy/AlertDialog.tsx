import LegacyButton from './Button';

// d1baf83c 의 apps/web/src/components/ui/AlertDialog.tsx 판을 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 문서 안에 놓으려고 Radix 포털·가림막·위치(fixed)는 빼고 판만 그린다. 예전 확인창은 실행 버튼 글자의
// 기본값이 "확인"이라, 폼의 삭제 확인(form/Action)도 "확인"으로 받았다.
export default function LegacyAlertPanel({
  description,
  confirmText = '확인',
}: {
  description: string;
  confirmText?: string;
}) {
  return (
    <div className="max-w-lg bg-white px-10 py-6 shadow-lg">
      <p className="mt-1 mb-6 text-neutral-800">{description}</p>
      <div className="flex justify-end gap-3">
        <LegacyButton variant="secondary">취소</LegacyButton>
        <LegacyButton variant="neutral">{confirmText}</LegacyButton>
      </div>
    </div>
  );
}
