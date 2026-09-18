import { Check } from 'lucide-react';
import { useState } from 'react';
import { COLORS, luminance } from '../-tokens';

// 팔레트가 바뀌어도 안 깨지도록 인덱스가 아니라 이름으로 찾는다.
const indexOf = (name: string) =>
  Math.max(
    0,
    COLORS.findIndex((c) => c.name === name),
  );

export function ContrastPreview() {
  const [foreground, setForeground] = useState(() => indexOf('neutral-950'));
  const [background, setBackground] = useState(() => indexOf('white'));
  const a = luminance(COLORS[foreground].hex);
  const b = luminance(COLORS[background].hex);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const names = ['주황색', '진한 주황색', '파란색', '흰색'];
  return (
    <div className="max-w-[960px] border border-neutral-200">
      <div className="grid grid-cols-2 gap-7 border-b border-neutral-200 bg-neutral-50 p-6 max-sm:grid-cols-1 max-sm:gap-6 max-sm:p-4">
        {(
          [
            ['contrast-foreground', '글자색', foreground, setForeground],
            ['contrast-background', '배경색', background, setBackground],
          ] as const
        ).map(([name, label, value, setter]) => (
          <fieldset key={name} className="min-w-0">
            <legend className="pb-3 text-xs/[inherit] text-neutral-600">
              {label}{' '}
              <code className="ml-3 inline-block">
                {COLORS[value].hex.toUpperCase()}
              </code>
            </legend>
            <div className="grid grid-cols-[repeat(auto-fill,40px)] gap-2">
              {COLORS.map((color, index) => {
                const colorLabel = `${names[index] ?? '중립색'} ${color.hex.toUpperCase()}`;
                return (
                  <label
                    key={color.name}
                    className="relative grid size-10 cursor-pointer place-items-center"
                    title={colorLabel}
                  >
                    <input
                      className="peer absolute size-px opacity-0"
                      type="radio"
                      name={name}
                      value={index}
                      checked={value === index}
                      onChange={() => setter(index)}
                      aria-label={colorLabel}
                    />
                    <span
                      className={`grid size-8 place-items-center border border-neutral-300 peer-checked:outline-1 peer-checked:outline-neutral-900 peer-checked:outline-offset-3 peer-focus-visible:outline-2 peer-focus-visible:outline-link peer-focus-visible:outline-offset-3 ${color.bg} ${luminance(color.hex) > 0.179 ? 'text-neutral-950' : 'text-white'}`}
                    >
                      <Check
                        className={value === index ? undefined : 'invisible'}
                        size={16}
                        aria-hidden="true"
                      />
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <div
        className={`flex min-h-45 flex-col items-center justify-center gap-2 p-6 text-center [&>span]:text-[48px]/[1.3] [&>span]:font-medium [&>p]:text-base/[inherit] ${COLORS[foreground].fg} ${COLORS[background].bg}`}
      >
        <span>Aa 가</span>
        <p>{'서울대학교 컴퓨터공학부'}</p>
      </div>
      <output
        className="flex flex-wrap items-center gap-x-6.5 gap-y-4 border-t border-neutral-200 p-5.5 [&>strong]:mr-auto [&>strong]:text-3xl/[1.4] [&>strong]:font-medium [&>strong]:tabular-nums [&_small]:ml-2 [&_small]:text-lg/[inherit] [&_small]:text-neutral-500 [&>span]:text-xs/[inherit] [&>span]:text-neutral-600 [&_b]:ml-1.5 [&_b]:font-bold [&_b]:text-neutral-950 max-sm:gap-2.5 max-sm:p-4.5 max-sm:[&>strong]:basis-full max-sm:[&>span]:basis-full"
        aria-live="polite"
      >
        <strong>
          {ratio.toFixed(2)}
          <small>: 1</small>
        </strong>
        <span>
          {'일반 텍스트'} AA <b>{ratio >= 4.5 ? '충족' : '미달'}</b>
        </span>
        <span>
          {'큰 텍스트'} AA <b>{ratio >= 3 ? '충족' : '미달'}</b>
        </span>
      </output>
    </div>
  );
}
