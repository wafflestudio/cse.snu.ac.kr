import type { Route } from '.react-router/types/app/routes/community/seminar/+types/index';
import { Fragment } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import { useSearchParams } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import Pagination from '~/components/ui/Pagination';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import type { SeminarPreviewList } from '~/types/api/v2/seminar';
import { getLocaleFromPathname } from '~/utils/string';
import SeminarRow from './components/SeminarRow';
import SeminarSearchBar from './components/SeminarSearchBar';

const POSTS_COUNT_PER_PAGE = 10;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const pageNum = url.searchParams.get('pageNum') || '1';
  const keyword = url.searchParams.get('keyword');

  const params = new URLSearchParams();
  params.append('pageNum', pageNum);
  params.append('language', locale);
  if (keyword) params.append('keyword', keyword);

  const response = await fetch(`${BASE_URL}/v2/seminar?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch seminar posts');

  return (await response.json()) as SeminarPreviewList;
}

export default function SeminarPage({
  loaderData: data,
}: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const { t, localizedPath } = useLanguage({
    세미나: 'Seminars',
    소식: 'Community',
    '검색 결과가 존재하지 않습니다.': 'No search results found.',
  });
  const subNav = useCommunitySubNav();

  const pageNum = Math.max(1, parseInt(searchParams.get('pageNum') || '1', 10));
  const totalPages = Math.ceil(data.total / POSTS_COUNT_PER_PAGE);

  return (
    <PageLayout title={t('세미나')} titleSize="xl" subNav={subNav}>
      <div className="flex flex-row items-center gap-6">
        <SeminarSearchBar />
      </div>

      <div className="mb-8 mt-10 flex flex-col border-b border-neutral-200">
        {data.searchList.length === 0 ? (
          <p className="py-8 text-center text-neutral-500">
            {t('검색 결과가 존재하지 않습니다.')}
          </p>
        ) : (
          data.searchList.map((post, index) => (
            <Fragment key={post.id}>
              {post.isYearLast && (
                <div
                  className={`border-b-2 border-neutral-700 ${index !== 0 ? 'mt-12' : ''}`}
                >
                  <h3 className="pb-2.5 text-[1.25rem] font-bold">
                    {new Date(post.startDate).getFullYear()}
                  </h3>
                </div>
              )}
              <div
                className={`border-neutral-200 py-[1.2rem] ${
                  !post.isYearLast ? 'border-t' : ''
                }`}
              >
                <SeminarRow seminar={post} />
              </div>
            </Fragment>
          ))
        )}
      </div>

      <Pagination page={pageNum} totalPages={totalPages} />

      <LoginVisible allow="ROLE_STAFF">
        <div className="mt-[40px] flex justify-end">
          <span className="ml-4">
            <Button
              variant="solid"
              tone="inverse"
              size="md"
              as="link"
              to={localizedPath('/community/seminar/create')}
            >
              새 게시글
            </Button>
          </span>
        </div>
      </LoginVisible>
    </PageLayout>
  );
}
