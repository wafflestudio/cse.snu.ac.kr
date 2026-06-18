import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { forwardRef } from 'react';

// 역할(kind) 기반 API. variant×tone 곱집합(무효 조합 다수) 대신 실사용 7개 역할만 노출한다.
// 각 kind는 기존 variant/tone 조합의 클래스를 그대로 재생산한다(픽셀 동일).
//   primary   = 강조 CTA(추가/재시도)             ← solid/brand
//   action    = 폼·다이얼로그 커밋(저장/삭제/확인) ← solid/inverse
//   secondary = 보조(취소/필터/페이지네이션)        ← outline/neutral
//   quiet     = 저강조 텍스트(밝은 표면)            ← text/neutral-500
//   link      = 인라인 링크형 텍스트               ← text/brand
//   nav       = 다크 헤더 유틸 버튼(흰 글자)         ← text/inverse
//   segmented = 세그먼트 토글(선택 dark/비선택 gray) ← solid/inverse|solid/neutral + selected
type ButtonKind =
  | 'primary'
  | 'action'
  | 'secondary'
  | 'quiet'
  | 'link'
  | 'nav'
  | 'segmented';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

type BaseProps = {
  kind: ButtonKind;
  size?: ButtonSize;
  selected?: boolean;
  iconLeft?: ReactNode;
  ariaLabel?: string;
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

// kind → 시각 클래스(기존 variant/tone 조합과 바이트 동일).
// 상태 의존(segmented)은 KIND_CLASSES에 없고 아래에서 따로 처리.
const KIND_CLASSES: Record<Exclude<ButtonKind, 'segmented'>, string> = {
  primary: 'rounded-[.0625rem] bg-main-orange text-white',
  action: 'rounded-[.0625rem] bg-neutral-700 text-white hover:bg-neutral-500',
  secondary:
    'rounded-[.0625rem] border border-neutral-200 bg-neutral-100 text-neutral-500 hover:bg-neutral-200',
  quiet: 'text-neutral-500 hover:text-white',
  link: 'text-main-orange hover:text-main-orange/80',
  nav: 'text-white hover:text-neutral-200',
};

// 텍스트형 kind는 padding 없는 TEXT_SIZE_CLASSES를 쓴다.
const TEXT_KINDS = new Set<ButtonKind>(['quiet', 'link', 'nav']);

function getButtonClass({
  kind,
  size,
  selected,
}: {
  kind: ButtonKind;
  size: ButtonSize;
  selected?: boolean;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition duration-200';

  if (kind === 'segmented') {
    const seg = selected
      ? 'rounded-[.0625rem] bg-neutral-700 text-white hover:bg-neutral-500'
      : 'rounded-[.0625rem] bg-neutral-200 text-neutral-700';
    return clsx(base, SIZE_CLASSES[size], seg);
  }

  const sizeClass = TEXT_KINDS.has(kind)
    ? TEXT_SIZE_CLASSES[size]
    : SIZE_CLASSES[size];
  return clsx(base, sizeClass, KIND_CLASSES[kind]);
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { kind, size = 'md', selected, iconLeft, ariaLabel, children } = props;

  const className = clsx(
    getButtonClass({ kind, size, selected }),
    props.as === 'button' || props.as === undefined
      ? 'disabled:cursor-not-allowed disabled:opacity-40'
      : '',
  );

  const content = (
    <>
      {iconLeft}
      {children !== undefined && children !== null && <span>{children}</span>}
    </>
  );

  if (props.as === 'link') {
    return (
      <Link to={props.to} className={className} aria-label={ariaLabel}>
        {content}
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
        {content}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={className}
      aria-pressed={kind === 'segmented' ? selected : undefined}
      aria-label={ariaLabel}
      ref={ref}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
