import clsx from 'clsx';
import { useId } from 'react';

// 알약 — 목록을 거르거나 정렬하는 단일 선택(/design-system#selection).
// 네이티브 radiogroup(fieldset+radio)이라 화살표 키 이동을 브라우저가 준다.
//   light: 고른 것 neutral-700 채움(입력 값이라 회색)
//   dark : 어두운 메인 공지 패널 전용 — 주황(메인 그래픽과 한 몸)
interface PillGroupProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  tone?: 'light' | 'dark';
}

const PILL =
  'inline-flex h-7.5 cursor-pointer select-none items-center whitespace-nowrap rounded-full border px-3 type-label transition duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2';

const TONE = {
  light: (selected: boolean) =>
    selected
      ? 'border-neutral-700 bg-neutral-700 text-white has-[:focus-visible]:outline-neutral-700'
      : 'border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100 has-[:focus-visible]:outline-neutral-700',
  dark: (selected: boolean) =>
    clsx(
      'border-main-orange-dark has-[:focus-visible]:outline-main-orange-dark',
      selected
        ? 'bg-main-orange-dark text-neutral-850'
        : 'text-main-orange-dark',
    ),
};

export default function PillGroup<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  tone = 'light',
}: PillGroupProps<T>) {
  const name = useId();
  return (
    <fieldset aria-label={ariaLabel} className="flex flex-wrap gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={clsx(PILL, TONE[tone](option.value === value))}
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
      ))}
    </fieldset>
  );
}
