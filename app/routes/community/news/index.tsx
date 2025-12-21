import type { Route } from '.react-router/types/app/routes/community/news/+types/index';
import type { LoaderFunctionArgs } from 'react-router';
import { useSearchParams } from 'react-router';
import Pagination from '~/components/common/Pagination';
import SearchBox from '~/components/common/SearchBox';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import type { NewsPreview, NewsPreviewList } from '~/types/api/v2/news';
import { getLocaleFromPathname } from '~/utils/string';
import NewsListRow from './components/NewsListRow';

const POST_LIMIT = 10;

const NEWS_TAGS = [
  '행사',
  '연구',
  '수상',
  '채용',
  '칼럼',
  '강연',
  '교육',
  '인터뷰',
  '진로',
  '과거 미분류',
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const pageNum = url.searchParams.get('pageNum') || '1';
  const keyword = url.searchParams.get('keyword') || '';
  const tag = url.searchParams.getAll('tag');

  const params = new URLSearchParams();
  params.append('pageNum', pageNum);
  params.append('language', locale);
  if (keyword) params.append('keyword', keyword);
  for (const t of tag) {
    params.append('tag', t);
  }

  const response = await fetch(`${BASE_URL}/v2/news?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch news posts');

  return (await response.json()) as NewsPreviewList;
}

export default function NewsPage({ loaderData: data }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage({ '새 소식': 'News', 커뮤니티: 'Community' });
  const subNav = useCommunitySubNav();

  const pageNum = parseInt(searchParams.get('pageNum') || '1', 10);
  const totalPages = Math.ceil(data.total / POST_LIMIT);

  return (
    <PageLayout
      title={t('새 소식')}
      titleSize="xl"
      breadcrumb={[
        { name: t('커뮤니티'), path: '/community' },
        { name: t('새 소식'), path: '/community/news' },
      ]}
      subNav={subNav}
    >
      <SearchBox tags={NEWS_TAGS} />
      <NewsList posts={data.searchList} />
      <Pagination page={pageNum} totalPages={totalPages} />
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
