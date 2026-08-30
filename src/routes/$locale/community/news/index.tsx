import { createFileRoute } from '@tanstack/react-router';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import SearchBox from '@/components/feature/SearchBox';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { useLanguage } from '@/hooks/useLanguage';
import { useCommunitySubNav } from '@/hooks/useSubNav';
import type { NewsPreview, NewsPreviewList } from '@/types/api/v2/news';
import { api } from '@/utils/api';
import {
  pageNumParam,
  stringArrayParam,
  stringParam,
} from '@/utils/searchSchema';
import NewsListRow from './-components/NewsListRow';
import { NEWS_TAGS } from './-constants';

const POST_LIMIT = 10;

interface NewsSearch {
  pageNum?: number;
  keyword?: string;
  tag?: string[];
}

const META = {
  ko: {
    title: '새 소식',
    description:
      '서울대학교 컴퓨터공학부의 새 소식을 확인하세요. 학부 행사, 연구 성과, 수상 소식, 학생 활동 등 다양한 뉴스를 제공합니다.',
  },
  en: {
    title: 'News',
    description:
      'Check the latest news from the Department of Computer Science and Engineering at Seoul National University. Find updates on events, research achievements, awards, and student activities.',
  },
};

function NewsPage() {
  const data = Route.useLoaderData();

  const search = Route.useSearch();
  const { t, localizedPath, locale } = useLanguage({
    '새 소식': 'News',
    커뮤니티: 'Community',
  });
  const subNav = useCommunitySubNav();
  const meta = META[locale];

  const { pageNum = 1 } = search;
  const totalPages = Math.ceil(data.total / POST_LIMIT);

  return (
    <PageLayout
      title={t('새 소식')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <SearchBox tags={NEWS_TAGS} />
      <NewsList posts={data.searchList} />
      <Pagination page={pageNum} totalPages={totalPages} />

      <LoginVisible allow="ROLE_STAFF">
        <div className="mt-[40px] flex justify-end">
          <span className="ml-4">
            <Button
              variant="neutral"
              size="md"
              as="link"
              to={localizedPath('/community/news/create')}
            >
              새 게시글
            </Button>
          </span>
        </div>
      </LoginVisible>
    </PageLayout>
  );
}

interface NewsListProps {
  posts: NewsPreview[];
}

function NewsList({ posts }: NewsListProps) {
  const { t } = useLanguage({
    '검색 결과가 존재하지 않습니다.': 'No search results found.',
  });

  if (posts.length === 0) {
    return (
      <p className="mx-2.5 mb-8 mt-6">{t('검색 결과가 존재하지 않습니다.')}</p>
    );
  }

  return (
    <div className="mb-8 mt-10 flex flex-col gap-5 sm:mx-10">
      {posts.map((post) => (
        <NewsListRow key={post.id} post={post} />
      ))}
    </div>
  );
}

export const Route = createFileRoute('/$locale/community/news/')({
  validateSearch: (search: Record<string, unknown>): NewsSearch => ({
    pageNum: pageNumParam(search.pageNum),
    keyword: stringParam(search.keyword),
    tag: stringArrayParam(search.tag),
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ params, deps }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    return api
      .get('v2/news', {
        searchParams: [
          ['pageNum', String(deps.pageNum ?? 1)],
          ['language', locale],
          ...(deps.keyword ? [['keyword', deps.keyword]] : []),
          ...(deps.tag ?? []).map((t) => ['tag', t]),
        ] as [string, string][],
      })
      .json<NewsPreviewList>();
  },
  component: NewsPage,
});
