import type { RegisterOptions } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';
import UiCheckbox from '@/components/ui/Checkbox';

// 모양은 ui/Checkbox 한 벌. 여기서는 폼 값에 잇기만 한다.
// 값이 배열이면(태그) value 를 넣고 빼고, 아니면 켜짐 = value(없으면 true)·꺼짐 = false.
interface CheckboxProps {
  name: string;
  value?: string;
  label?: string;
  options?: RegisterOptions;
  disabled?: boolean;
  onChange?: (isChecked: boolean) => void;
}

export default function Checkbox({
  value,
  name,
  label = value,
  options,
  disabled = false,
  onChange,
}: CheckboxProps) {
  const { register, setValue } = useFormContext();
  register(name, options);
  const current = useWatch({ name });

  const isArray = Array.isArray(current);
  const checked = isArray ? current.includes(value) : Boolean(current);

  return (
    <UiCheckbox
      label={label}
      value={value}
      checked={checked}
      disabled={disabled}
      onChange={(next) => {
        const nextValue = isArray
          ? next
            ? [...current, value]
            : current.filter((x: unknown) => x !== value)
          : next && (value ?? true);
        // 늘 검사한다 — 입력마다 검사하는 폼(예약: mode onChange, 동의해야 제출 가능)의
        // isValid 가 체크에 따라 바뀌어야 한다. 규칙이 있는 체크박스는 동의 하나뿐이다.
        setValue(name, nextValue, { shouldDirty: true, shouldValidate: true });
        onChange?.(next);
      }}
    />
  );
}
