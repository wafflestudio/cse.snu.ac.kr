import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface TagProps {
  label: string;
  href?: string;
  onClick?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

// 태그 = 글의 분류(/design-system/selection). 주황 테두리 알약, 13px, 높이 24.
// 누르면 그 분류의 목록으로 가고 호버하면 주황 채움. 선택 컨트롤로 쓰지 않는다(그건 PillGroup).
const BASE_CLASS =
  'inline-flex h-6 items-center rounded-full border border-main-orange bg-white px-3 type-meta whitespace-nowrap text-main-orange transition duration-200';

const HOVER_CLASS = 'hover:bg-main-orange hover:text-white';

export function Tag({
  label,
  href,
  onClick,
  onDelete,
  disabled = false,
}: TagProps) {
  const isInteractive = Boolean(href || onClick);
  const className = clsx(
    BASE_CLASS,
    isInteractive && !disabled && HOVER_CLASS,
    isInteractive && !disabled && 'cursor-pointer',
    disabled && 'opacity-60 cursor-not-allowed',
  );

  const content = (
    <>
      <span>{label}</span>
      {onDelete && (
        // 삭제 X — 이 한 곳뿐이라 Button kind으로 빼지 않고 직접 정의(브랜드색 아이콘 버튼).
        <button
          type="button"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          aria-label={`${label} 삭제`}
          className="-mr-1 inline-flex size-6 items-center justify-center text-main-orange transition duration-200 hover:text-main-orange-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X />
        </button>
      )}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={className} aria-disabled={disabled}>
        {content}
      </Link>
    );
  }

  if (onClick && !onDelete) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        disabled={disabled}
      >
        {content}
      </button>
    );
  }

  return <span className={className}>{content}</span>;
}
