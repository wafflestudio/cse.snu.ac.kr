import { Circle } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

// 테두리 원 + 켜지면 가운데에 원 지름 절반의 채운 점(/design-system/form).
// lucide 원은 틀의 20/24라, 틀 1.2em 의 절반(0.6em)이면 점 지름이 바깥 원의 50%.
interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: string;
  checked: boolean;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, checked, ...inputProps }, ref) => {
    const id = useId();
    return (
      <label
        htmlFor={id}
        className="group flex w-fit cursor-pointer items-center gap-1 whitespace-nowrap type-ui text-neutral-600"
      >
        <span className="relative inline-flex shrink-0">
          <Circle
            className={
              checked
                ? 'text-neutral-700'
                : 'text-neutral-500 group-hover:text-neutral-600'
            }
          />
          {checked && (
            <Circle className="absolute top-1/2 left-1/2 size-[0.6em]! -translate-x-1/2 -translate-y-1/2 fill-current stroke-0 text-neutral-700" />
          )}
        </span>
        {label}
        <input
          ref={ref}
          id={id}
          type="radio"
          className="sr-only"
          checked={checked}
          {...inputProps}
        />
      </label>
    );
  },
);

Radio.displayName = 'Radio';

export default Radio;
