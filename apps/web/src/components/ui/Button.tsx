import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { forwardRef } from 'react';

// 역할은 행동의 종류로 정한다(디자인 시스템 2-1). 주황 채움 버튼은 없다.
//   primary     = 주요(추가·새 글·저장·게시·등록·예약, 확인창의 실행)  ← 짙은 회색 채움
//   secondary   = 보조(편집·취소·목록·해제, 폼·상세의 삭제)          ← 연한 회색 채움
//   text        = 밝은 면의 글자·아이콘 버튼                         ← 글자
//   textInverse = 어두운 면(헤더·모바일 메뉴)의 글자·아이콘 버튼       ← 흰 글자
// (단일 선택 토글은 Button variant이 아니라 네이티브 radiogroup으로 — faculty 정렬·공지 필터.)
type ButtonVariant = 'primary' | 'secondary' | 'text' | 'textInverse';
type ButtonSize = 'md' | 'sm';

type BaseProps = {
  variant: ButtonVariant;
  size?: ButtonSize;
  ariaLabel?: string;
  // 아이콘은 children에 직접 넣는다(shadcn식). base의 gap-2가 아이콘·텍스트 간격을 처리.
  children?: ReactNode;
  // 아이콘만 든 채운 버튼 — 높이와 같은 폭의 정사각형으로 둔다(ariaLabel 필수).
  iconOnly?: boolean;
};

type ButtonAsButton = BaseProps & {
  as?: 'button';
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  disabled?: boolean;
  // 처리 중: 누를 수 없게 하고 글자를 pendingLabel 로 바꾼다.
  pending?: boolean;
  pendingLabel?: string;
};

type ButtonAsLink = BaseProps & {
  as: 'link';
  to: string;
};

type ButtonAsAnchor = BaseProps & {
  as: 'a';
  href: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
};

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

// 높이는 줄높이가 아니라 h-* 로 정한다(글자 줄높이는 1.2).
const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'h-8.5 px-4',
  sm: 'h-6 px-3',
};

const ICON_ONLY_SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'size-8.5',
  sm: 'size-6',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'rounded-xs bg-neutral-700 text-white hover:bg-neutral-600 active:bg-neutral-500',
  secondary:
    'rounded-xs border border-neutral-200 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 active:bg-neutral-300',
  text: 'text-neutral-600 hover:text-main-orange active:text-main-orange-dark',
  textInverse: 'text-white hover:text-main-orange active:text-main-orange-dark',
};

// 글자형 variant는 패딩이 없다(크기는 글자·아이콘이 정한다).
const TEXT_VARIANTS = new Set<ButtonVariant>(['text', 'textInverse']);

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant, size = 'md', ariaLabel, children, iconOnly } = props;

  const className = clsx(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap type-label transition duration-200',
    !TEXT_VARIANTS.has(variant) &&
      (iconOnly ? ICON_ONLY_SIZE_CLASSES : SIZE_CLASSES)[size],
    VARIANT_CLASSES[variant],
    (props.as === 'button' || props.as === undefined) &&
      'disabled:cursor-not-allowed disabled:opacity-40',
  );

  if (props.as === 'link') {
    return (
      <Link to={props.to} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  if (props.as === 'a') {
    return (
      <a
        href={props.href}
        className={className}
        target={props.target}
        rel={props.rel}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  const { pending = false, pendingLabel } = props;

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled || pending}
      aria-busy={pending || undefined}
      className={className}
      aria-label={ariaLabel}
      ref={ref}
    >
      {pending && pendingLabel !== undefined ? (
        // 처리 중에만 원래 글자를 숨겨 겹쳐 둔다 — 평소엔 원래 폭, 처리 중 글자가 길면 그때만 늘어난다.
        <span className="grid">
          <span className="invisible col-start-1 row-start-1 inline-flex items-center justify-center gap-2">
            {children}
          </span>
          <span className="col-start-1 row-start-1 inline-flex items-center justify-center">
            {pendingLabel}
          </span>
        </span>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
