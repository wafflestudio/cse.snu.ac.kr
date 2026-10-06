import clsx from 'clsx';
import { X } from 'lucide-react';
import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/components/ui/Tag.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// Do·Don't 의 Don't, 개선 전후의 "전"을 실제 예전 태그처럼 움직이게 그린다.
// 라우터 링크(href)는 누르면 이동하지 않는 <a>(onClick=stay) 로 바꿨다. 예전 값: 높이 26px, 13px, 모서리 1.875rem.

type LegacyTagVariant = 'outline' | 'solid';

interface LegacyTagProps {
  label: string;
  href?: string;
  onClick?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  variant?: LegacyTagVariant;
}

const BASE_CLASS =
  'inline-flex h-[26px] items-center rounded-[1.875rem] border px-2.5 text-[13px] font-medium whitespace-nowrap transition duration-200';

const VARIANT_CLASSES: Record<LegacyTagVariant, string> = {
  outline: 'bg-white border-main-orange text-main-orange',
  solid: 'bg-main-orange border-main-orange text-white',
};

const HOVER_CLASSES: Record<LegacyTagVariant, string> = {
  outline: 'hover:bg-main-orange hover:border-main-orange hover:text-white',
  solid: 'hover:bg-main-orange-dark hover:border-main-orange-dark',
};

export function LegacyTag({
  label,
  href,
  onClick,
  onDelete,
  disabled = false,
  variant = 'outline',
}: LegacyTagProps) {
  const isInteractive = Boolean(href || onClick);
  const className = clsx(
    BASE_CLASS,
    VARIANT_CLASSES[variant],
    isInteractive && !disabled && HOVER_CLASSES[variant],
    isInteractive && !disabled && 'cursor-pointer',
    disabled && 'opacity-60 cursor-not-allowed',
  );

  const content = (
    <>
      <span className={onDelete ? 'pr-1.5' : ''}>{label}</span>
      {onDelete && (
        <button
          type="button"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          aria-label={`${label} 삭제`}
          className="inline-flex items-center justify-center text-main-orange transition duration-200 hover:text-main-orange/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="h-[13px] w-[13px]" />
        </button>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={stay}
        className={className}
        aria-disabled={disabled}
      >
        {content}
      </a>
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
