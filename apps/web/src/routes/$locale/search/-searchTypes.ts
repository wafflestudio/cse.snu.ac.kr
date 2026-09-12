import type { SearchResultType } from '@/types/api';

/**
 * 검색 필터 칩(= 사이드바 최상위 메뉴)이 어떤 결과 종류를 포함하는지.
 *
 * 라벨은 navigationTree 에서 가져오지만 "어떤 type 이 어느 묶음이냐"는 백엔드
 * enum 과의 대응이라 트리에서 끌어낼 수 없다. 여기 한 곳에만 둔다.
 */
export const TAG_TO_TYPES = {
  소개: ['about'],
  소식: ['notice', 'news', 'seminar'],
  구성원: ['professor', 'emeritus-professor', 'staff'],
  연구·교육: ['research-group', 'research-center', 'lab', 'conference'],
  입학: ['admissions'],
  '학사 및 교과': ['academics', 'course', 'scholarship'],
} satisfies Record<string, SearchResultType[]>;

export const SEARCH_TAGS = Object.keys(
  TAG_TO_TYPES,
) as (keyof typeof TAG_TO_TYPES)[];

export function tagsToTypes(tags: string[]): SearchResultType[] {
  return tags.flatMap(
    (tag) => TAG_TO_TYPES[tag as keyof typeof TAG_TO_TYPES] ?? [],
  );
}
