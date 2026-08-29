/**
 * 사이트 이름 상수
 */
export const SITE_NAME = {
  ko: '서울대학교 컴퓨터공학부',
  en: 'Dept. of CSE, SNU',
} as const;

/**
 * HTML 태그를 제거하고 순수 텍스트만 반환
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Description 길이를 제한 (기본 160자)
 */
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}
