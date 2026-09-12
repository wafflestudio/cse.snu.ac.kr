import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import SearchBox from '@/components/feature/SearchBox';
import PageLayout from '@/components/layout/PageLayout';
import Pagination from '@/components/ui/Pagination';
import { useLanguage } from '@/hooks/useLanguage';
import { useSetToggle } from '@/hooks/useSetToggle';
import { useCommunitySubNav } from '@/hooks/useSubNav';
import type { NoticePreviewList } from '@/types/api';
import { api } from '@/utils/api';
import {
  pageNumParam,
  stringArrayParam,
  stringParam,
} from '@/utils/searchSchema';
import AdminFeatures from './-components/AdminFeatures';
import NoticeListRow, {
  NOTICE_ROW_CELL_WIDTH,
} from './-components/NoticeListRow';
import { NOTICE_TAGS } from './-constants';

const POST_LIMIT = 20;

interface NoticeSearch {
  pageNum?: number;
  keyword?: string;
  tag?: string[];
}

const META = {
  ko: {
    title: '공지사항',
    description:
      '서울대학교 컴퓨터공학부의 공지사항을 확인하세요. 학사, 장학, 채용, 행사 등 학부의 주요 소식과 공지를 제공합니다.',
  },
  en: {
    title: 'Notice',
    description:
      'Check the notices from the Department of Computer Science and Engineering at Seoul National University. Find academic, scholarship, recruitment, and event announcements.',
  },
};

function NoticePage() {
  const data = Route.useLoaderData();

  const { pageNum = 1 } = Route.useSearch();
  const { t, locale } = useLanguage({
    제목: 'Title',
    날짜: 'Date',
    '검색 결과가 존재하지 않습니다.': 'No search results found.',
  });
  const subNav = useCommunitySubNav();
  const meta = META[locale];

  const [isEditMode, setIsEditMode] = useState(false);
  const {
    selected: selectedIds,
    toggle: toggleSelection,
    clear,
  } = useSetToggle<number>();

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    clear();
  };

  const totalPages = Math.ceil(data.total / POST_LIMIT);

  return (
    <PageLayout
      title={t('공지사항')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <SearchBox tags={NOTICE_TAGS} disabled={isEditMode} />

      {data.searchList.length === 0 ? (
        <p className="mx-2.5 mb-8 mt-6">
          {t('검색 결과가 존재하지 않습니다.')}
        </p>
      ) : (
        <div className="mb-10 mt-9 border-y border-neutral-200 sm:mx-2.5">
          <h5 className="hidden h-11 items-center border-b border-neutral-200 pl-12.5 text-[15px] text-neutral-800 sm:flex">
            <span
              className={`${NOTICE_ROW_CELL_WIDTH.title} min-w-0 grow whitespace-nowrap tracking-wide sm:pl-3`}
            >
              {t('제목')}
            </span>
            <span
              className={`whitespace-nowrap text-left tracking-wide sm:pl-8 sm:pr-10`}
            >
              <span className="inline-block w-20">{t('날짜')}</span>
            </span>
          </h5>
          <ul
            className={`${
              isEditMode && 'divide-y divide-dashed divide-neutral-200'
            }`}
          >
            {data.searchList.map((post) => (
              <NoticeListRow
                key={post.id}
                post={post}
                isEditMode={isEditMode}
                isSelected={selectedIds.has(post.id)}
                onToggleSelect={() => toggleSelection(post.id)}
              />
            ))}
          </ul>
        </div>
      )}

      <Pagination
        page={pageNum}
        totalPages={totalPages}
        disabled={isEditMode}
      />

      <LoginVisible allow="ROLE_STAFF">
        <AdminFeatures
          selectedIds={selectedIds}
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
        />
      </LoginVisible>
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/community/notice/')({
  validateSearch: (search: Record<string, unknown>): NoticeSearch => ({
    pageNum: pageNumParam(search.pageNum),
    keyword: stringParam(search.keyword),
    tag: stringArrayParam(search.tag),
  }),
  // loader가 실제로 쓰는 것만 선언한다(전체를 넘기면 무관한 파라미터 변경에도 재실행).
  loaderDeps: ({ search }) => search,
  loader: ({ params, deps }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    return api
      .get('v2/notice', {
        searchParams: [
          ['pageNum', String(deps.pageNum ?? 1)],
          ['language', locale],
          ...(deps.keyword ? [['keyword', deps.keyword]] : []),
          ...(deps.tag ?? []).map((t) => ['tag', t]),
        ] as [string, string][],
      })
      .json<NoticePreviewList>();
  },
  component: NoticePage,
});
