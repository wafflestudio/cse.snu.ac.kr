import clsx from 'clsx';
import type { MouseEvent, ReactNode } from 'react';
import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/components/ui/Button.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// Do·Don't 의 Don't, 개선 전후의 "전"을 실제 예전 버튼처럼 움직이게 그린다.
// 라우터 링크(as="link")는 빼고, 링크는 누르면 이동하지 않는 <a>(onClick=stay) 로 둔다.
// 예전 토큰 값은 지금과 같아(text-md=14px, main-orange=#ff6914) 클래스를 그대로 쓴다.
//   primary   = 강조 CTA(추가/재시도)            ← 오렌지 solid
//   neutral   = 폼·다이얼로그 커밋(저장/삭제/확인) ← 다크 solid
//   secondary = 보조(취소/필터/페이지네이션)       ← 아웃라인
//   quiet     = 저강조 텍스트(밝은 표면)           ← 텍스트
//   nav       = 다크 헤더 유틸 버튼(흰 글자)        ← 텍스트(흰색)
type LegacyButtonVariant =
  | 'primary'
  | 'neutral'
  | 'secondary'
  | 'quiet'
  | 'nav';
type LegacyButtonSize = 'xs' | 'sm' | 'md' | 'lg';

type BaseProps = {
  variant: LegacyButtonVariant;
  size?: LegacyButtonSize;
  ariaLabel?: string;
  children?: ReactNode;
};

type LegacyButtonProps =
  | (BaseProps & {
      as?: 'button';
      onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
      disabled?: boolean;
    })
  | (BaseProps & { as: 'a'; href?: string });

const SIZE_CLASSES: Record<LegacyButtonSize, string> = {
  xs: 'text-xs sm:text-md px-0 py-0',
  sm: 'text-sm px-2.5 py-1',
  md: 'text-md px-[.875rem] py-[.3125rem] leading-6',
  lg: 'text-lg px-4 py-2',
};

const TEXT_SIZE_CLASSES: Record<LegacyButtonSize, string> = {
  xs: 'text-xs sm:text-md font-normal tracking-[.02em]',
  sm: 'text-sm font-normal',
  md: 'text-md font-normal',
  lg: 'text-lg font-normal',
};

const VARIANT_CLASSES: Record<LegacyButtonVariant, string> = {
  primary: 'rounded-[.0625rem] bg-main-orange text-white',
  neutral: 'rounded-[.0625rem] bg-neutral-700 text-white hover:bg-neutral-500',
  secondary:
    'rounded-[.0625rem] border border-neutral-200 bg-neutral-100 text-neutral-500 hover:bg-neutral-200',
  quiet: 'text-neutral-500 hover:text-white',
  nav: 'text-white hover:text-neutral-200',
};

const TEXT_VARIANTS = new Set<LegacyButtonVariant>(['quiet', 'nav']);

export default function LegacyButton(props: LegacyButtonProps) {
  const { variant, size = 'md', ariaLabel, children } = props;
  const className = clsx(
    'inline-flex items-center justify-center gap-2 font-medium transition duration-200',
    TEXT_VARIANTS.has(variant) ? TEXT_SIZE_CLASSES[size] : SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    props.as !== 'a' && 'disabled:cursor-not-allowed disabled:opacity-40',
  );

  if (props.as === 'a') {
    return (
      <a
        href={props.href ?? '#'}
        onClick={stay}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
