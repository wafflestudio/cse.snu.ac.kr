import type { Route } from '.react-router/types/app/routes/academics/undergraduate/curriculum/+types/index';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import TimelineViewer from '~/routes/academics/components/timeline/TimelineViewer';
import type { TimelineContent } from '~/types/api/v2/academics';
import { fetchJson } from '~/utils/fetch';

export async function loader() {
  return await fetchJson<TimelineContent[]>(
    `${BASE_URL}/v2/academics/undergraduate/curriculum`,
  );
}

export default function UndergraduateCurriculumPage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage({ 학번: 'Student ID' });
  const subNav = useAcademicsSubNav();
  const title = t('전공 이수 표준 형태');
  const breadcrumb = [
    { name: t('학사 및 교과'), path: '/academics' },
    { name: t('학부'), path: '/academics/undergraduate' },
    {
      name: t('전공 이수 표준 형태'),
      path: '/academics/undergraduate/curriculum',
    },
  ];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <TimelineViewer
        contents={loaderData}
        title={{ text: t('전공 이수 표준 형태'), unit: t('학번') }}
      />
    </PageLayout>
  );
}
