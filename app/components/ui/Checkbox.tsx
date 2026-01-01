import { Square, SquareCheck } from 'lucide-react';
import { useId } from 'react';

interface CheckboxProps {
  id?: string;
  label?: string;
  name?: string;
  value?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Checkbox({
  id,
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  className,
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  // label이 있는 경우
  return (
    <label
      htmlFor={inputId}
      className={`group flex h-5 w-fit items-center gap-1 whitespace-nowrap ${
        !disabled && 'cursor-pointer'
      } ${className ?? ''}`}
    >
      {(() => {
        const Icon = checked ? SquareCheck : Square;
        return (
          <Icon
            className={`h-[18px] w-[18px] text-neutral-400 ${
              !disabled &&
              'group-hover:text-neutral-600 group-active:text-main-orange'
            } ${checked && 'text-neutral-600'}`}
            strokeWidth={1.5}
          />
        );
      })()}
      <span
        className={`text-md tracking-wide text-neutral-600 ${
          !disabled && 'group-active:text-main-orange'
        }`}
      >
        {label}
      </span>
      <input
        type="checkbox"
        id={inputId}
        name={name}
        className="appearance-none"
        value={value ?? label}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
