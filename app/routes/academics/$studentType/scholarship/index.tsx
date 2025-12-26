import type { Route } from '.react-router/types/app/routes/academics/$studentType/scholarship/+types/index';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import LoginVisible from '~/components/common/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import ScholarshipList from '~/routes/academics/components/ScholarshipList';
import type { StudentType } from '~/types/api/v2/academics';
import type { ScholarshipList as ScholarshipListType } from '~/types/api/v2/academics/scholarship';
import { fetchJson } from '~/utils/fetch';

export async function loader({ params }: Route.LoaderArgs) {
  const { studentType } = params;
  return await fetchJson<ScholarshipListType>(
    `${BASE_URL}/v2/academics/${studentType}/scholarship`,
  );
}

export default function ScholarshipPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { studentType } = params;
  const { t } = useLanguage();
  const subNav = useAcademicsSubNav();

  const title = t('장학 제도');
  const studentLabel = studentType === 'graduate' ? t('대학원') : t('학부');
  const breadcrumb = [
    { path: '/academics', name: t('학사 및 교과') },
    { name: studentLabel },
    { path: `/academics/${studentType}/scholarship`, name: t('장학 제도') },
  ];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 flex justify-end">
          <Button variant="outline" tone="neutral" as="link" to="edit">
            편집
          </Button>
        </div>
      </LoginVisible>
      <HTMLViewer html={loaderData.description} />
      <ScholarshipList
        scholarships={loaderData.scholarships}
        studentType={studentType as StudentType}
      />
    </PageLayout>
  );
}
