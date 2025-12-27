/**
 * 현재 시간을 한국 로케일 문자열로 변환
 * @returns "2024. 12. 27. 15:30:45" 형식의 문자열
 */
export function getKoreanDateTime(): string {
  return new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * 파일명에 사용할 수 있는 날짜/시간 문자열 생성
 * @returns "2024-12-27_15-30-45" 형식의 문자열
 */
export function getFileNameDateTime(): string {
  return getKoreanDateTime()
    .replace(/\. /g, '-')
    .replace(/\./g, '')
    .replace(/ /g, '_')
    .replace(/:/g, '-');
}
