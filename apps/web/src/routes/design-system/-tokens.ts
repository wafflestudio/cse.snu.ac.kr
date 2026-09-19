// app.css 의 `@theme` 값을 옮겨 적은 것. 토큰을 바꾸면 여기도 고친다.
export const COLORS = [
  {
    name: 'main-orange',
    hex: '#ff6914',
    bg: 'bg-main-orange',
    fg: 'text-main-orange',
  },
  {
    name: 'main-orange-muted',
    hex: '#e65817',
    bg: 'bg-main-orange-muted',
    fg: 'text-main-orange-muted',
  },
  { name: 'link', hex: '#3c7be4', bg: 'bg-link', fg: 'text-link' },
  { name: 'white', hex: '#ffffff', bg: 'bg-white', fg: 'text-white' },
  {
    name: 'neutral-50',
    hex: '#fafafa',
    bg: 'bg-neutral-50',
    fg: 'text-neutral-50',
  },
  {
    name: 'neutral-100',
    hex: '#f5f5f5',
    bg: 'bg-neutral-100',
    fg: 'text-neutral-100',
  },
  {
    name: 'neutral-200',
    hex: '#e5e5e5',
    bg: 'bg-neutral-200',
    fg: 'text-neutral-200',
  },
  {
    name: 'neutral-300',
    hex: '#d4d4d4',
    bg: 'bg-neutral-300',
    fg: 'text-neutral-300',
  },
  {
    name: 'neutral-400',
    hex: '#a3a3a3',
    bg: 'bg-neutral-400',
    fg: 'text-neutral-400',
  },
  {
    name: 'neutral-500',
    hex: '#737373',
    bg: 'bg-neutral-500',
    fg: 'text-neutral-500',
  },
  {
    name: 'neutral-600',
    hex: '#525252',
    bg: 'bg-neutral-600',
    fg: 'text-neutral-600',
  },
  {
    name: 'neutral-700',
    hex: '#404040',
    bg: 'bg-neutral-700',
    fg: 'text-neutral-700',
  },
  {
    name: 'neutral-800',
    hex: '#262626',
    bg: 'bg-neutral-800',
    fg: 'text-neutral-800',
  },
  {
    name: 'neutral-850',
    hex: '#1e1e1e',
    bg: 'bg-neutral-850',
    fg: 'text-neutral-850',
  },
  {
    name: 'neutral-900',
    hex: '#171717',
    bg: 'bg-neutral-900',
    fg: 'text-neutral-900',
  },
  {
    name: 'neutral-950',
    hex: '#0a0a0a',
    bg: 'bg-neutral-950',
    fg: 'text-neutral-950',
  },
];

export const SHELL = [
  { name: 'shell-100', hex: '#323235', bg: 'bg-shell-100' },
  { name: 'shell-200', hex: '#2d2d30', bg: 'bg-shell-200' },
  { name: 'shell-300', hex: '#262728', bg: 'bg-shell-300' },
  { name: 'shell-400', hex: '#1f2021', bg: 'bg-shell-400' },
];

/** 크기와 행간은 한 쌍이다 — `text-md` 하나로 둘 다 정해진다(`app.css` 의 `@theme`). */
export const TYPE_SCALE = [
  {
    name: '3xl',
    px: 30,
    leading: 1.2,
    className: 'text-3xl',
    role: '페이지 제목 · 메인 영역 제목',
  },
  {
    name: '2xl',
    px: 24,
    leading: 1.2,
    className: 'text-2xl',
    role: '좁은 화면의 페이지 제목',
  },
  {
    name: 'xl',
    px: 20,
    leading: 1.2,
    className: 'text-xl',
    role: '게시물 제목 · 모달 제목',
  },
  {
    name: 'lg',
    px: 18,
    leading: 1.2,
    className: 'text-lg',
    role: '영역 안의 소제목',
  },
  {
    name: 'base',
    px: 16,
    leading: 1.35,
    className: 'text-base',
    role: '좁은 화면의 목록·카드 제목',
  },
  {
    name: 'md',
    px: 14,
    leading: 1.35,
    className: 'text-md',
    role: '본문 · 폼 라벨 · 버튼',
  },
  {
    name: 'sm',
    px: 13,
    leading: 1.35,
    className: 'text-sm',
    role: '목록 칸 · 날짜 · 표',
  },
  {
    name: 'xs',
    px: 12,
    leading: 1.35,
    className: 'text-xs',
    role: '배지 · 캡션 · 부가 정보',
  },
];

/** 굵기는 셋이다. 400·500·700 밖은 쓰지 않는다. */
export const WEIGHT_SCALE = [
  {
    name: 'normal',
    value: 400,
    className: 'font-normal',
    role: '본문과 읽는 글',
  },
  {
    name: 'medium',
    value: 500,
    className: 'font-medium',
    role: '컨트롤과 반복되는 항목의 제목',
  },
  { name: 'bold', value: 700, className: 'font-bold', role: '제목과 강조' },
];

/** WCAG 상대 휘도. 스와치 위에 올릴 글자색을 고르는 데 쓴다. */
export function luminance(hex: string) {
  const rgb = [1, 3, 5].map((offset) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

export const ICON_SCALE = [
  {
    name: 'size-3',
    px: 12,
    className: 'size-3',
    textClassName: 'text-xs',
    role: '12px 글자 옆',
  },
  {
    name: 'size-4',
    px: 16,
    className: 'size-4',
    textClassName: 'text-md',
    role: '13·14·16px 글자 옆 — 기본',
  },
  {
    name: 'size-6',
    px: 24,
    className: 'size-6',
    textClassName: 'text-2xl',
    role: '20px 이상 제목 옆',
  },
] as const;
