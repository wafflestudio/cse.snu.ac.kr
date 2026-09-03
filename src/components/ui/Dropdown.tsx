import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

// 인덱스 기반 API는 그대로 유지(호출부 6곳 무변경). 내부는 CSS 위치 기반 커스텀 구현이다.
// Radix Select(popper)는 floating-ui로 위치를 동적 인라인 스타일(transform: translate(x,y) …)로
// 주입하는데, 값이 매번 달라 strict CSP의 style-src를 nonce·해시로 못 잡는다(=`unsafe-inline`
// 강요). 그래서 직접 구현: 리스트박스를 트리거 바로 아래 `absolute`로 깔아 인라인 스타일 0.
// 키보드 내비·타입어헤드·ARIA combobox/listbox로 접근성은 유지한다.
interface DropdownProps {
  contents: string[];
  selectedIndex: number;
  onClick: (index: number) => void;
  borderStyle?: string;
  height?: string;
}

export default function Dropdown({
  contents,
  selectedIndex,
  onClick,
  borderStyle = 'border-neutral-200',
  height,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex < 0 ? 0 : selectedIndex,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef<{ str: string; timer: number }>({
    str: '',
    timer: 0,
  });
  const listboxId = useId();

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // 열릴 때: 활성 항목을 선택값으로 맞추고 리스트로 포커스 이동
  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex < 0 ? 0 : selectedIndex);
    listRef.current?.focus();
  }, [open, selectedIndex]);

  // 활성 항목을 보이게 스크롤
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const select = (index: number) => {
    onClick(index);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, contents.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(contents.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        select(activeIndex);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        // 타입어헤드: 글자를 모아 접두사로 점프
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          window.clearTimeout(typeahead.current.timer);
          typeahead.current.str += e.key.toLowerCase();
          const found = contents.findIndex((c) =>
            c.toLowerCase().startsWith(typeahead.current.str),
          );
          if (found >= 0) setActiveIndex(found);
          typeahead.current.timer = window.setTimeout(() => {
            typeahead.current.str = '';
          }, 500);
        }
    }
  };

  return (
    <div ref={rootRef} className="relative inline-flex flex-col">
      {/* 닫힌 트리거: 기존 마크업/클래스 유지(픽셀 동일) */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        className={`flex select-none items-center gap-4 rounded-xs border bg-white py-[.3125rem] pl-[.625rem] pr-[.3125rem] ${borderStyle} ${height ?? ''}`}
      >
        <span className="text-md font-normal">
          {contents[selectedIndex] ?? ''}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0" />
      </button>

      {open && (
        // div + role: 시맨틱은 role(listbox/option)으로 부여한다. ul/li를 쓰면 biome가
        // noNoninteractiveElementToInteractiveRole로 오탐한다(WAI-ARIA는 ul=listbox 허용).
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listboxId}-opt-${activeIndex}`}
          onKeyDown={handleListKeyDown}
          className={`styled-scrollbar absolute top-full left-0 z-10 max-h-[168px] w-full overflow-y-auto overscroll-contain rounded-bl-sm rounded-br-sm border-x border-b bg-white outline-none ${borderStyle}`}
        >
          {contents.map((content, index) => (
            // 키보드는 listbox onKeyDown에서 aria-activedescendant로 일괄 처리하는 WAI-ARIA
            // 표준 패턴이라 option은 개별 포커스/키핸들러를 두지 않는다.
            // biome-ignore lint/a11y/useFocusableInteractive: aria-activedescendant 패턴 — option 비포커스
            // biome-ignore lint/a11y/useKeyWithClickEvents: 키보드는 listbox onKeyDown에서 일괄 처리
            <div
              key={index}
              id={`${listboxId}-opt-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => select(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex h-7 w-full cursor-pointer items-center pl-[.62rem] text-left text-sm font-normal ${
                index === activeIndex ? 'bg-neutral-200' : ''
              } ${index === selectedIndex ? 'text-main-orange' : ''}`}
            >
              {content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
