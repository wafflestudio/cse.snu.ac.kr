import type { SearchResult } from '@/types/api';
import type { Locale } from '@/types/i18n';
import { api } from '@/utils/api';
import { tagsToTypes } from './-searchTypes';

/** 한 번에 받아오는 결과 수. 첫 장은 loader(SSR), 그 뒤는 무한 스크롤이 이어 붙인다. */
const PAGE_SIZE = 20;

interface SearchPageArgs {
  keyword: string;
  locale: Locale;
  tags: string[];
  pageNum: number;
}

/** loader(SSR)와 무한 스크롤(클라)이 같은 요청을 만들도록 한 곳에 둔다. */
export function fetchSearchPage({
  keyword,
  locale,
  tags,
  pageNum,
}: SearchPageArgs): Promise<SearchResult> {
  const searchParams = new URLSearchParams({
    keyword,
    language: locale === 'en' ? 'en' : 'ko',
    pageNum: String(pageNum),
    pageSize: String(PAGE_SIZE),
  });
  // 태그를 안 고르면 전 도메인. 고르면 그 묶음의 종류만.
  for (const type of tagsToTypes(tags)) searchParams.append('type', type);

  return api.get(`v2/search?${searchParams.toString()}`).json<SearchResult>();
}
