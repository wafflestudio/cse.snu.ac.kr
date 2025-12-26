import type { Route } from '.react-router/types/app/routes/academics/graduate/guide/+types/index';
import Attachments from '~/components/common/Attachments';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import LoginVisible from '~/components/common/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type { Guide } from '~/types/api/v2/academics';
import { fetchJson } from '~/utils/fetch';

export async function loader() {
  return fetchJson<Guide>(`${BASE_URL}/v2/academics/graduate/guide`);
}

export default function GraduateGuidePage({
  loaderData,
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage();
  const subNav = useAcademicsSubNav();

  const title = t('대학원 안내');
  const breadcrumb = [
    { path: '/academics', name: t('학사 및 교과') },
    { name: t('대학원') },
    { path: '/academics/graduate/guide', name: t('대학원 안내') },
  ];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 text-right">
          <Button
            as="link"
            to={localizedPath('/academics/graduate/guide/edit')}
            variant="outline"
            tone="neutral"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>
      <Attachments files={loaderData.attachments} />
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
