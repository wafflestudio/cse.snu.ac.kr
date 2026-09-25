import clsx from 'clsx';
import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import Button from './Button';

// 검색 칸 한 부품(/design-system#search). 검색 실행은 감싸는 form 의 onSubmit 이 맡는다.
//   light: 입력 칸 한 벌(34·테두리 300·흰), 폭 보통 320
//   dark : 헤더 막대 위 테두리 없는 채움 칸(neutral-100), 폭 216
// id 는 useId 로 — 헤더와 검색 상자가 한 화면에 있어도 겹치지 않는다.
interface SearchInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'className' | 'id'
  > {
  ariaLabel: string;
  label?: string; // 칸 위 이름(검색 상자). 없으면 화면 읽기용 이름만.
  tone?: 'light' | 'dark';
}

export default function SearchInput({
  ariaLabel,
  label,
  tone = 'light',
  ...inputProps
}: SearchInputProps) {
  const id = useId();
  const light = tone === 'light';
  return (
    <div className={light ? 'w-full max-w-80' : 'w-54'}>
      {label && (
        <label htmlFor={id} className="mb-2 block type-label">
          {label}
        </label>
      )}
      <div
        className={clsx(
          'flex h-8.5 items-center rounded-xs pr-2',
          light ? 'border border-neutral-300 bg-white' : 'bg-neutral-100',
        )}
      >
        <input
          id={id}
          type="text"
          aria-label={label ? undefined : ariaLabel}
          className="h-full w-full min-w-0 bg-transparent pl-3 type-ui outline-none placeholder:text-neutral-300"
          {...inputProps}
        />
        {/* 아이콘 20px + 둘레 2px 로 클릭 영역 24px. */}
        <Button type="submit" variant="text" ariaLabel={ariaLabel}>
          <Search className="box-content size-5 p-0.5" />
        </Button>
      </div>
    </div>
  );
}
