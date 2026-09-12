import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { forwardRef } from 'react';

// variant 기반 API. (과거 variant×tone 곱집합 — 무효 조합 다수 — 대신 실사용 5개만 노출.)
//   primary   = 강조 CTA(추가/재시도)            ← 오렌지 solid
//   neutral   = 폼·다이얼로그 커밋(저장/삭제/확인) ← 다크 solid
//   secondary = 보조(취소/필터/페이지네이션)       ← 아웃라인
//   quiet     = 저강조 텍스트(밝은 표면)           ← 텍스트
//   nav       = 다크 헤더 유틸 버튼(흰 글자)        ← 텍스트(흰색)
// (단일 선택 토글은 Button variant이 아니라 네이티브 radiogroup으로 — faculty 정렬·공지 필터.)
type ButtonVariant = 'primary' | 'neutral' | 'secondary' | 'quiet' | 'nav';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

type BaseProps = {
  variant: ButtonVariant;
  size?: ButtonSize;
  ariaLabel?: string;
  // 아이콘은 children에 직접 넣는다(shadcn식). base의 gap-2가 아이콘·텍스트 간격을 처리.
  children?: ReactNode;
};

type ButtonAsButton = BaseProps & {
  as?: 'button';
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  disabled?: boolean;
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

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'text-xs sm:text-md px-0 py-0',
  sm: 'text-sm px-2.5 py-1',
  md: 'text-md px-[.875rem] py-[.3125rem] leading-6',
  lg: 'text-lg px-4 py-2',
};

const TEXT_SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'text-xs sm:text-md font-normal tracking-[.02em]',
  sm: 'text-sm font-normal',
  md: 'text-md font-normal',
  lg: 'text-lg font-normal',
};

// variant → 시각 클래스(기존 variant/tone 조합과 바이트 동일).
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'rounded-[.0625rem] bg-main-orange text-white',
  neutral: 'rounded-[.0625rem] bg-neutral-700 text-white hover:bg-neutral-500',
  secondary:
    'rounded-[.0625rem] border border-neutral-200 bg-neutral-100 text-neutral-500 hover:bg-neutral-200',
  quiet: 'text-neutral-500 hover:text-white',
  nav: 'text-white hover:text-neutral-200',
};

// 텍스트형 variant는 padding 없는 TEXT_SIZE_CLASSES를 쓴다.
const TEXT_VARIANTS = new Set<ButtonVariant>(['quiet', 'nav']);

function getButtonClass({
  variant,
  size,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition duration-200';
  const sizeClass = TEXT_VARIANTS.has(variant)
    ? TEXT_SIZE_CLASSES[size]
    : SIZE_CLASSES[size];
  return clsx(base, sizeClass, VARIANT_CLASSES[variant]);
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant, size = 'md', ariaLabel, children } = props;

  const className = clsx(
    getButtonClass({ variant, size }),
    props.as === 'button' || props.as === undefined
      ? 'disabled:cursor-not-allowed disabled:opacity-40'
      : '',
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

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={className}
      aria-label={ariaLabel}
      ref={ref}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
