import clsx from 'clsx';
import { type KeyboardEvent, type ReactNode, useId, useRef } from 'react';

// 밑줄 탭 — 같은 자리의 패널을 바꾼다(/design-system/selection). 값을 저장하지 않으니 라디오가 아니라 탭이다.
// WAI-ARIA 탭 패턴: tablist·tab·tabpanel, 고른 탭만 Tab 순서에 있고(roving tabindex) ←→·Home·End 로 옮기면 바로 바뀐다.
// 고른 탭은 neutral-950 + 아래 2px 선, 나머지 500·호버 주황(글자 토글과 같다). 초점 링은 전역 :focus-visible.
interface TabsProps<T extends string> {
  tabs: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  // 지금 고른 탭의 패널. 탭을 바꾸면 쓰는 쪽이 다른 패널을 넘긴다.
  children: ReactNode;
}

export default function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
  children,
}: TabsProps<T>) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabId = (v: T) => `${id}-tab-${v}`;
  const panelId = `${id}-panel`;

  const move = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    onChange(tabs[next].value);
    refs.current[next]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    move(keys[e.key]);
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex gap-4 border-b border-neutral-200"
      >
        {tabs.map((tab, index) => {
          const selected = tab.value === value;
          return (
            <button
              key={tab.value}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabId(tab.value)}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={clsx(
                '-mb-px border-b-2 pb-2 type-label whitespace-nowrap transition duration-200',
                selected
                  ? 'border-neutral-950 text-neutral-950'
                  : 'cursor-pointer border-transparent text-neutral-500 hover:text-main-orange',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId(value)}
        className="pt-6"
      >
        {children}
      </div>
    </div>
  );
}
