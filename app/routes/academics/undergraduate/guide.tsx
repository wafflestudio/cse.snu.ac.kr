import type { Route } from '.react-router/types/app/routes/academics/undergraduate/+types/guide';
import Attachments from '~/components/common/Attachments';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type { Guide } from '~/types/api/v2/academics';

export async function loader() {
  const response = await fetch(`${BASE_URL}/v2/academics/undergraduate/guide`);
  if (!response.ok) {
    throw new Error('Failed to fetch undergraduate guide data');
  }

  return (await response.json()) as Guide;
}

export default function UndergraduateGuidePage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage();
  const subNav = useAcademicsSubNav();

  const title = t('학부 안내');
  const breadcrumb = [
    { path: '/academics', name: t('학사 및 교과') },
    { name: t('학부') },
    { path: '/academics/undergraduate/guide', name: t('학부 안내') },
  ];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <Attachments files={loaderData.attachments} />
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
