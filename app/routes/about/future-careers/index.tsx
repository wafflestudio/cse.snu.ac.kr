import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { FutureCareersResponse } from '~/types/api/future-careers';
import { getLocaleFromPathname } from '~/utils/string';
import CareerCompanies from './components/CareerCompanies';
import CareerStat from './components/CareerStat';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `${BASE_URL}/v2/about/future-careers?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch future careers');

  return (await response.json()) as FutureCareersResponse;
}

export default function FutureCareersPage() {
  const data = useLoaderData<typeof loader>();
  const { t } = useLanguage({
    '졸업생 진로': 'Career Paths',
  });
  const subNav = useAboutSubNav();

  return (
    <PageLayout
      title={t('졸업생 진로')}
      titleType="big"
      breadcrumb={[
        { name: t('학부 소개'), path: '/about/overview' },
        { name: t('졸업생 진로'), path: '/about/future-careers' },
      ]}
      subNav={subNav}
      removePadding
    >
      <div className="px-5 pb-12 pt-7 sm:py-11 sm:pl-25 sm:pr-[360px]">
        <HTMLViewer htmlContent={data.description} />
        <CareerStat stat={data.stat} />
        <CareerCompanies companies={data.companies} />
      </div>
    </PageLayout>
  );
}
