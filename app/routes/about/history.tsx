import type { Route } from '.react-router/types/app/routes/about/+types/history';
import type { LoaderFunctionArgs } from 'react-router';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { AboutContent } from '~/types/api/v2';
import { getLocaleFromPathname } from '~/utils/string';
import historyImage from './assets/history.png';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `https://cse.snu.ac.kr/api/v2/about/history?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch history');

  return (await response.json()) as AboutContent;
}

export default function HistoryPage({ loaderData }: Route.ComponentProps) {
  const { t } = useLanguage();
  const subNav = useAboutSubNav();

  return (
    <PageLayout
      title={t('연혁')}
      titleType="big"
      breadcrumb={[
        { name: t('학부 소개'), path: '/about/overview' },
        { name: t('연혁'), path: '/about/history' },
      ]}
      subNav={subNav}
      removePadding
    >
      <div className="px-5 pb-12 pt-7 sm:py-11 sm:pl-25 sm:pr-[360px]">
        <HTMLViewer
          htmlContent={loaderData.description}
          topRightImage={{
            src: historyImage,
            width: 320,
            height: 360,
            mobileFullWidth: true,
          }}
        />
      </div>
    </PageLayout>
  );
}
