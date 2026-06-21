import { createFileRoute } from '@tanstack/react-router';
import { Fragment } from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { useSearchParams } from '@/hooks/useSearchParams';
import { useCommunitySubNav } from '@/hooks/useSubNav';
import type { SeminarPreviewList } from '@/types/api/v2/seminar';
import SeminarRow from './components/SeminarRow';
import SeminarSearchBar from './components/SeminarSearchBar';

const POSTS_COUNT_PER_PAGE = 10;

const META = {
  ko: {
    title: '세미나',
    description:
      '서울대학교 컴퓨터공학부의 세미나 일정과 정보를 확인하세요. 국내외 저명한 연구자들의 강연과 최신 연구 동향을 만나보실 수 있습니다.',
  },
  en: {
    title: 'Seminars',
    description:
      'Check the seminar schedule from the Department of Computer Science and Engineering at Seoul National University. Attend lectures by renowned researchers and learn about the latest research trends.',
  },
};

function SeminarPage() {
  const data = Route.useLoaderData();

  const [searchParams] = useSearchParams();
  const { t, localizedPath, locale } = useLanguage({
    세미나: 'Seminars',
    소식: 'Community',
    '검색 결과가 존재하지 않습니다.': 'No search results found.',
  });
  const subNav = useCommunitySubNav();
  const meta = META[locale];

  const pageNum = Math.max(1, parseInt(searchParams.get('pageNum') || '1', 10));
  const totalPages = Math.ceil(data.total / POSTS_COUNT_PER_PAGE);

  return (
    <PageLayout
      title={t('세미나')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
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
              variant="neutral"
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

export const Route = createFileRoute('/$locale/community/seminar/')({
  loader: async ({ params, location }) => {
    const searchStr = location.searchStr;
    const sp = new URLSearchParams(searchStr);
    const locale = params.locale === 'en' ? 'en' : 'ko';

    const pageNum = sp.get('pageNum') || '1';
    const keyword = sp.get('keyword');

    const query = new URLSearchParams();
    query.append('pageNum', pageNum);
    query.append('language', locale);
    if (keyword) query.append('keyword', keyword);

    const response = await fetch(`${BASE_URL}/v2/seminar?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch seminar posts');

    return (await response.json()) as SeminarPreviewList;
  },
  component: SeminarPage,
});
