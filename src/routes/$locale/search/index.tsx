import { createFileRoute } from '@tanstack/react-router';
import SearchBox from '@/components/feature/SearchBox';
import PageLayout from '@/components/layout/PageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import type { SearchResult } from '@/types/api';
import { api } from '@/utils/api';
import { stringArrayParam, stringParam } from '@/utils/searchSchema';
import NoSearchResult from './-components/ui/NoSearchResult';
import SearchResultRow from './-components/ui/SearchResultRow';
import { SEARCH_TAGS, tagsToTypes } from './-searchTypes';
import MagnificentGlass from './assets/magnificent_glass.svg?react';

const PAGE_SIZE = 20;

function SearchPage() {
  const { keyword, result, tooShort } = Route.useLoaderData();
  const { t, locale } = useLanguage();

  return (
    <PageLayout title={t('통합 검색')} titleSize="xl" titleMargin="mb-11">
      <SearchBox tags={[...SEARCH_TAGS]} formOnly />

      {tooShort && (
        <div className="flex flex-col items-center">
          <p className="text-base font-medium text-neutral-300">
            {t('검색어를 두글자 이상 입력해주세요')}
          </p>
          <MagnificentGlass />
        </div>
      )}

      {!tooShort && keyword && result?.total === 0 && <NoSearchResult />}

      {!tooShort && keyword && result && result.total > 0 && (
        <>
          <p className="mb-11 ml-3 text-md text-neutral-500 sm:mb-14">
            {locale === 'en'
              ? `${result.total} results`
              : `${result.total}개의 검색결과`}
          </p>
          <div className="flex grow flex-col gap-7">
            {result.results.map((item) => (
              <SearchResultRow key={`${item.type}:${item.id}`} item={item} />
            ))}
          </div>
        </>
      )}
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/search/')({
  validateSearch: (search: Record<string, unknown>) => ({
    keyword: stringParam(search.keyword),
    tag: stringArrayParam(search.tag),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const keyword = deps.keyword;
    const tag = deps.tag ?? [];
    if (!keyword) return { keyword, tag };
    if (keyword.length < 2) return { keyword, tag, tooShort: true };

    const searchParams = new URLSearchParams({
      keyword,
      language: params.locale === 'en' ? 'en' : 'ko',
      pageSize: String(PAGE_SIZE),
    });
    // 태그를 안 고르면 전 도메인. 고르면 그 묶음의 종류만.
    for (const type of tagsToTypes(tag)) searchParams.append('type', type);

    const result = await api
      .get(`v2/search?${searchParams.toString()}`)
      .json<SearchResult>();

    return { keyword, tag, result };
  },
  component: SearchPage,
});
