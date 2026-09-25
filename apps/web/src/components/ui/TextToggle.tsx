import clsx from 'clsx';
import { Fragment, useId } from 'react';

// 글자 토글 — 같은 자리의 보기를 바꾸는 조용한 단일 선택(/design-system#selection).
// 고른 것 neutral-950, 나머지 500·호버 주황(2-1 글자 버튼), 사이는 1px 세로선.
interface TextToggleProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export default function TextToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: TextToggleProps<T>) {
  const name = useId();
  return (
    <fieldset
      aria-label={ariaLabel}
      className="flex items-center gap-3 type-label"
    >
      {options.map((option, index) => (
        <Fragment key={option.value}>
          {index > 0 && (
            <span aria-hidden className="h-3 w-px bg-neutral-300" />
          )}
          <label
            className={clsx(
              'whitespace-nowrap transition duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-neutral-700',
              option.value === value
                ? 'text-neutral-950'
                : 'cursor-pointer text-neutral-500 hover:text-main-orange',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        </Fragment>
      ))}
    </fieldset>
  );
}
