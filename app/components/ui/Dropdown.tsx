import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

// 인덱스 기반 API는 그대로 유지(호출부 변경 없음). 내부만 Radix Select로 교체해
// 키보드 내비·타입어헤드·ARIA combobox 등 접근성을 확보한다.
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
  return (
    <Select.Root
      value={String(selectedIndex)}
      onValueChange={(value) => onClick(Number(value))}
    >
      {/* 닫힌 트리거: 기존 hand-rolled 버튼과 동일한 마크업/클래스(픽셀 동일) */}
      <Select.Trigger
        className={`flex select-none items-center gap-4 rounded-xs border bg-white py-[.3125rem] pl-[.625rem] pr-[.3125rem] ${borderStyle} ${height ?? ''}`}
      >
        <span className="text-md font-normal">
          <Select.Value />
        </span>
        <Select.Icon>
          <ChevronDown className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={0}
          className={`styled-scrollbar z-10 max-h-[168px] overflow-y-auto overscroll-contain rounded-bl-sm rounded-br-sm border-x border-b bg-white ${borderStyle}`}
          style={{ width: 'var(--radix-select-trigger-width)' }}
        >
          <Select.Viewport>
            {contents.map((content, index) => (
              <Select.Item
                key={index}
                value={String(index)}
                className="flex h-7 w-full cursor-pointer items-center pl-[.62rem] text-left text-sm font-normal outline-none hover:bg-neutral-200 data-[state=checked]:text-main-orange"
              >
                <Select.ItemText>{content}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
