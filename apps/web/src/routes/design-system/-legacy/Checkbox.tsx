import { Square, SquareCheck } from 'lucide-react';
import { useId } from 'react';

// d1baf83c 의 apps/web/src/components/ui/Checkbox.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 진짜 입력은 appearance-none 으로 모양을 지우고 아이콘만 그려서, Tab 으로 초점이 와도 표시가 없다.
// 예전 값: 아이콘 18px·선 1.5, 꺼짐 neutral-400, 켜짐 600, 누르는 동안 주황, 글자 14px 넓은 자간.
export function LegacyCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const inputId = useId();
  const Icon = checked ? SquareCheck : Square;

  return (
    <label
      htmlFor={inputId}
      className="group flex h-5 w-fit cursor-pointer items-center gap-1 whitespace-nowrap"
    >
      <Icon
        className={`h-[18px] w-[18px] text-neutral-400 group-hover:text-neutral-600 group-active:text-main-orange ${checked && 'text-neutral-600'}`}
        strokeWidth={1.5}
      />
      <span className="text-md tracking-wide text-neutral-600 group-active:text-main-orange">
        {label}
      </span>
      <input
        type="checkbox"
        id={inputId}
        className="appearance-none"
        value={label}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
