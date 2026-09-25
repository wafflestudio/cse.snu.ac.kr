// 입력 칸(글자·드롭다운·날짜·시간)의 모양 한 벌(/design-system#form).
// 높이 34 = 보통 버튼, 테두리 neutral-300, 바탕 흰색, 안쪽 여백 12.
export const FIELD_CLASS =
  'h-8.5 rounded-xs border bg-white px-3 type-ui outline-none placeholder:text-neutral-300 disabled:text-neutral-300';

// 오류면 테두리만 red-600.
export const fieldBorder = (invalid: boolean) =>
  invalid ? 'border-red-600' : 'border-neutral-300';

// 글자 입력 폭 네 단계 — 들어갈 내용의 길이로 고른다.
export const FIELD_WIDTH = {
  sm: 'w-20', // 숫자·연도·호수
  md: 'w-full max-w-80', // 이름·전화·이메일
  lg: 'w-full max-w-120', // 주소·웹사이트·한 줄 설명
  full: 'w-full', // 제목
} as const;

export type FieldWidth = keyof typeof FIELD_WIDTH;
