import type { Route } from '.react-router/types/app/routes/academics/undergraduate/+types/degree-requirements';
import Attachments from '~/components/common/Attachments';
import HTMLViewer from '~/components/common/HTMLViewer';
import Node from '~/components/common/Nodes';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type { DegreeRequirements } from '~/types/api/v2/academics/undergraduate/degree-requirements';
import { fetchJson } from '~/utils/fetch';

export async function loader() {
  return await fetchJson<DegreeRequirements>(
    `${BASE_URL}/v2/academics/undergraduate/degree-requirements`,
  );
}

export default function DegreeRequirementsPage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage({
    '공통: 졸업사정 유의사항': 'Common: Graduation Review Notes',
  });
  const subNav = useAcademicsSubNav();
  const title = t('졸업 규정');
  const breadcrumb = [
    { name: t('학사 및 교과'), path: '/academics' },
    { name: t('학부'), path: '/academics/undergraduate' },
    {
      name: t('졸업 규정'),
      path: '/academics/undergraduate/degree-requirements',
    },
  ];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <Attachments files={loaderData.attachments} />
      <div className="mb-4 mt-6 flex w-[200px] flex-col">
        <h3 className="mb-2 pl-3 text-lg font-bold">
          {t('공통: 졸업사정 유의사항')}
        </h3>
        <Node variant="straight" />
      </div>
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
