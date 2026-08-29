const CLASSIFICATION = {
  전공필수: 'RM',
  전공선택: 'EM',
  교양: 'LE',
} as const;

export type Classification = keyof typeof CLASSIFICATION;

export type SortOption = '학년' | '교과목 구분' | '학점';
export type ViewOption = '카드형' | '목록형';
