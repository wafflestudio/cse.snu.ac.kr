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
//   quiet     = 어두운 표면의 저강조 텍스트         ← 텍스트(회색, 헤더 검색·모바일 내비)
//   nav       = 어두운 표면의 유틸 버튼             ← 텍스트(흰색)
// (단일 선택 토글은 Button variant이 아니라 네이티브 radiogroup으로 — faculty 정렬·공지 필터.)
type ButtonVariant = 'primary' | 'neutral' | 'secondary' | 'quiet' | 'nav';
type ButtonSize = 'sm' | 'md' | 'lg';

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
  sm: 'min-h-7 text-sm/4 px-2.5 py-1',
  md: 'min-h-8 text-md/5 px-3.5 py-1',
  lg: 'min-h-10 text-lg/6 px-4 py-1.5',
};

const TEXT_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-sm font-normal',
  md: 'text-md font-normal',
  lg: 'text-lg font-normal',
};

// 채움은 hover 에서 밝아지고 누르면 어두워진다. 텍스트형은 표면이 어두워서 방향이 뒤집힌다.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'rounded-[.0625rem] bg-main-orange text-white hover:bg-main-orange-hover active:bg-main-orange-active',
  neutral:
    'rounded-[.0625rem] bg-neutral-700 text-white hover:bg-neutral-500 active:bg-neutral-800',
  secondary:
    'rounded-[.0625rem] border border-neutral-200 bg-neutral-100 text-neutral-500 hover:bg-neutral-200 active:border-neutral-300 active:bg-neutral-300 active:text-neutral-700',
  quiet: 'text-neutral-400 hover:text-white active:text-neutral-300',
  nav: 'text-white hover:text-neutral-300 active:text-neutral-400',
};

// 텍스트형 variant는 padding 없는 TEXT_SIZE_CLASSES를 쓴다.
const TEXT_VARIANTS = new Set<ButtonVariant>(['quiet', 'nav']);

// 초점 링은 표면을 따른다 — 링크 색(파랑)은 뜻이 겹쳐 쓰지 않는다.
// 밝은 면 neutral-800(15:1) · 어두운 면 흰색(18:1). 둘 다 기준 3:1 을 넘는다.
const DARK_SURFACE_VARIANTS = new Set<ButtonVariant>(['quiet', 'nav']);

function getButtonClass({
  variant,
  size,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2';
  const sizeClass = TEXT_VARIANTS.has(variant)
    ? TEXT_SIZE_CLASSES[size]
    : SIZE_CLASSES[size];
  const ring = DARK_SURFACE_VARIANTS.has(variant)
    ? 'focus-visible:outline-white'
    : 'focus-visible:outline-neutral-800';
  return clsx(base, sizeClass, VARIANT_CLASSES[variant], ring);
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
