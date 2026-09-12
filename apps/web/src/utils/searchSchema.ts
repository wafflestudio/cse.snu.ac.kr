/**
 * `validateSearch` 헬퍼. 각 라우트가 자기 스키마를 선언할 때 쓴다.
 *
 * ⚠️ 빈 값은 반드시 `undefined`로 남긴다 — validateSearch 결과는 URL로 다시 직렬화되므로
 * 기본값을 채우면 `?pageNum=1&keyword=&tag=[]`처럼 URL이 오염되고, 그 URL을 읽는 다른
 * 컴포넌트(SearchBox의 '태그 초기화' 등)가 오작동한다.
 */

/** 1보다 클 때만 URL에 남기는 페이지 번호. */
export const pageNumParam = (value: unknown): number | undefined => {
  const n = Number(value);
  return Number.isInteger(n) && n > 1 ? n : undefined;
};

/**
 * 비어 있지 않을 때만 남기는 문자열.
 * ⚠️ 숫자도 받는다 — 기본 파서가 `?selected=123`을 JSON.parse해 number로 주기 때문에
 * 문자열만 받으면 숫자 id 선택이 조용히 사라진다(연구 센터/그룹에서 겪음).
 */
export const stringParam = (value: unknown): string | undefined => {
  if (typeof value === 'number') return String(value);
  return typeof value === 'string' && value ? value : undefined;
};

/** 반복 키(`?tag=a&tag=b`)는 배열, 1개면 문자열로 들어온다 → 비어 있지 않을 때만 배열로. */
export const stringArrayParam = (value: unknown): string[] | undefined => {
  const arr = Array.isArray(value)
    ? value.map(String).filter((v) => v !== '')
    : typeof value === 'string' && value
      ? [value]
      : [];
  return arr.length > 0 ? arr : undefined;
};
