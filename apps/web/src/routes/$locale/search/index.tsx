import { createFileRoute } from '@tanstack/react-router';
import SearchBox from '@/components/feature/SearchBox';
import PageLayout from '@/components/layout/PageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { stringArrayParam, stringParam } from '@/utils/searchSchema';
import { fetchSearchPage } from './-api';
import SearchResultList from './-components/SearchResultList';
import NoSearchResult from './-components/ui/NoSearchResult';
import { SEARCH_TAGS } from './-searchTypes';
import MagnificentGlass from './assets/magnificent_glass.svg?react';

function SearchPage() {
  const { keyword, tag, result, tooShort } = Route.useLoaderData();
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
          {/* 검색 조건이 바뀌면 재마운트해 이어 붙인 결과를 버린다. */}
          <SearchResultList
            key={`${keyword}|${tag.join(',')}`}
            keyword={keyword}
            tags={tag}
            firstPage={result}
          />
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

    const result = await fetchSearchPage({
      keyword,
      locale: params.locale === 'en' ? 'en' : 'ko',
      tags: tag,
      pageNum: 1,
    });

    return { keyword, tag, result };
  },
  component: SearchPage,
});
