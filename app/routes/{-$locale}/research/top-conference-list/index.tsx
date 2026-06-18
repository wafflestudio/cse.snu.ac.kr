import { createFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import PageLayout from '@/components/layout/PageLayout';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { useResearchSubNav } from '@/hooks/useSubNav';
import type { TopConferenceListResponse } from '@/types/api/v2/conference';
import ConferenceListTable from './components/ConferenceListTable';

const META = {
  ko: {
    title: 'Top Conference List',
    description:
      '서울대학교 컴퓨터공학부가 선정한 주요 국제 학술대회 목록입니다. 컴퓨터과학 분야의 최고 수준 컨퍼런스 정보를 제공합니다.',
  },
  en: {
    title: 'Top Conference List',
    description:
      'List of top international conferences selected by the Department of Computer Science and Engineering at Seoul National University. Find information about premier conferences in computer science.',
  },
};

function TopConferenceListPage() {
  const loaderData = Route.useLoaderData();

  const { t, locale } = useLanguage({
    '서울대학교 공과대학 컴퓨터공학부':
      'Department of Computer Science and Engineering, Seoul National University',
    '본 리스트는 시간과 상황의 변동에 따라 바뀔 수 있습니다':
      'This list may change depending on time and circumstances',
    '수정 날짜': 'Last updated',
    작성자: 'Author',
  });
  const subNav = useResearchSubNav();
  const meta = META[locale];
  const { modifiedAt, author, conferenceList } = loaderData;

  const dateStr = dayjs(modifiedAt)
    .locale(locale)
    .format(locale === 'en' ? 'MMM D, YYYY' : 'YYYY. M. D');

  return (
    <PageLayout
      title={t('Top Conference List')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <div className="flex flex-col text-neutral-950">
        <h3 className="mb-5 text-base font-bold leading-8">
          {t('서울대학교 공과대학 컴퓨터공학부')} Top Conference List
        </h3>
        <p className="text-md leading-[26px]">
          {t('본 리스트는 시간과 상황의 변동에 따라 바뀔 수 있습니다')}.
        </p>
        <p className="text-md leading-[26px]">
          {t('수정 날짜')}: {dateStr}
          <br />
          {t('작성자')}: {author}
        </p>
        <ConferenceListTable conferenceList={conferenceList} />
      </div>
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/{-$locale}/research/top-conference-list/',
)({
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const response = await fetch(
      `${BASE_URL}/v2/conference/page?language=${locale}`,
    );
    if (!response.ok) throw new Error('Failed to fetch top conference list');

    return (await response.json()) as TopConferenceListResponse;
  },
  component: TopConferenceListPage,
});
