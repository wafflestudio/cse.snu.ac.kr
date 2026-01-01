import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useController } from 'react-hook-form';

import { useClickOutside } from '~/hooks/useClickOutside';
import type { Rules } from '~/types/form';

interface DropdownProps {
  contents: { label: string; value: unknown }[];
  name: string;
  borderStyle?: string;
  width?: string;
  height?: string;
  isDisabled?: boolean;
  rules?: Rules;
  onChange?: (value: unknown) => void;
}

export default function Dropdown({
  contents,
  name,
  borderStyle,
  width,
  height,
  isDisabled,
  rules,
  onChange: onChangeFromProp,
}: DropdownProps) {
  const {
    field: { value, onChange: onChangeFromController },
  } = useController({ name, rules });

  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(
    ref,
    useCallback(() => setExpanded(false), []),
  );

  const toggleExpanded = () => setExpanded((x) => !x);

  const onChange = (value: unknown) => {
    onChangeFromController(value);
    onChangeFromProp?.(value);
  };

  const handleClick = (index: number) => {
    onChange(contents[index].value);
    toggleExpanded();
  };

  return (
    <div className="relative select-none w-fit" ref={ref}>
      <button
        type="button"
        className={clsx(
          'flex w-full items-center border bg-white py-[.3125rem] pl-[.625rem] pr-[.3125rem]',
          expanded ? 'rounded-t-sm' : 'rounded-sm',
          borderStyle,
          width ? `${width} justify-between` : 'gap-4',
          height,
          isDisabled && 'opacity-30',
        )}
        onClick={(e) => {
          e.preventDefault();
          toggleExpanded();
        }}
        disabled={isDisabled}
      >
        <p className="text-md font-normal">
          {contents.find((x) => x.value === value)?.label}
        </p>
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      <div className="relative z-10">
        <DropdownListWithScroll
          className={clsx(width, expanded ? 'scale-y-100' : 'scale-y-0')}
          contents={contents.map((x) => x.label)}
          handleClick={handleClick}
          selectedIndex={value}
          borderStyle={borderStyle}
        />
      </div>
    </div>
  );
}

function DropdownListWithScroll({
  className,
  contents,
  handleClick,
  selectedIndex,
  borderStyle = 'border-neutral-200',
}: {
  className: string;
  contents: string[];
  handleClick: (index: number) => void;
  selectedIndex: number;
  borderStyle?: string;
}) {
  return (
    <div
      className={clsx(
        'styled-scrollbar absolute flex flex-col left-0 top-0 max-h-[168px] origin-top overflow-y-scroll overscroll-contain rounded-bl-sm rounded-br-sm border bg-white transition duration-200',
        className,
        borderStyle,
      )}
    >
      {contents.map((content, index) => (
        <button
          key={index}
          type="button"
          className={clsx(
            'h-7 shrink-0 pl-[.62rem] text-left text-nowrap text-sm font-normal hover:bg-neutral-200 focus:border focus:border-neutral-400 ',
            selectedIndex === index && 'text-main-orange',
          )}
          onClick={(e) => {
            e.preventDefault();
            handleClick(index);
          }}
        >
          {content}
        </button>
      ))}
    </div>
  );
}
