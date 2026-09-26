import clsx from 'clsx';
import { Square, SquareCheck } from 'lucide-react';
import { useId } from 'react';

// 켜짐 neutral-700(주요 버튼 면)·꺼짐 neutral-500, 호버하면 꺼진 아이콘 600(/design-system/form).
interface CheckboxProps {
  label?: string;
  name?: string;
  value?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Checkbox({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
}: CheckboxProps) {
  const id = useId();
  const Icon = checked ? SquareCheck : Square;

  return (
    <label
      htmlFor={id}
      className={clsx(
        'group flex w-fit items-center gap-1 whitespace-nowrap type-ui text-neutral-600',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
      )}
    >
      <Icon
        className={clsx(
          'shrink-0',
          checked
            ? 'text-neutral-700'
            : clsx(
                'text-neutral-500',
                !disabled && 'group-hover:text-neutral-600',
              ),
        )}
      />
      {label}
      <input
        type="checkbox"
        id={id}
        name={name}
        className="sr-only"
        value={value ?? label}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
