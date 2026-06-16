import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { X } from 'lucide-react';
import Button from '~/components/ui/Button';

type TagVariant = 'outline' | 'solid';

interface TagProps {
  label: string;
  href?: string;
  onClick?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  variant?: TagVariant;
}

const BASE_CLASS =
  'inline-flex h-[26px] items-center rounded-[1.875rem] border px-2.5 text-[13px] font-medium whitespace-nowrap transition duration-200';

const VARIANT_CLASSES: Record<TagVariant, string> = {
  outline: 'bg-white border-main-orange text-main-orange',
  solid: 'bg-main-orange border-main-orange text-white',
};

const HOVER_CLASSES: Record<TagVariant, string> = {
  outline: 'hover:bg-main-orange hover:border-main-orange hover:text-white',
  solid: 'hover:bg-main-orange-dark hover:border-main-orange-dark',
};

export function Tag({
  label,
  href,
  onClick,
  onDelete,
  disabled = false,
  variant = 'outline',
}: TagProps) {
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
        <Button
          kind="link"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          ariaLabel={`${label} 삭제`}
        >
          <X className="h-[13px] w-[13px]" />
        </Button>
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
