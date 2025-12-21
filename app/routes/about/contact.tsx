import type { Route } from '.react-router/types/app/routes/about/+types/contact';
import type { LoaderFunctionArgs } from 'react-router';
import ContentSection from '~/components/common/ContentSection';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import { getLocaleFromPathname } from '~/utils/string';

interface ContactResponse {
  description: string;
  imageURL: string | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(
    `${BASE_URL}/v2/about/contact?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch contact');

  return (await response.json()) as ContactResponse;
}

export default function ContactPage({
  loaderData: { description, imageURL },
}: Route.ComponentProps) {
  const { t } = useLanguage({ 연락처: 'Contact' });
  const subNav = useAboutSubNav();

  return (
    <PageLayout
      title={t('연락처')}
      titleSize="xl"
      breadcrumb={[
        { name: t('학부 소개'), path: '/about/overview' },
        { name: t('연락처'), path: '/about/contact' },
      ]}
      subNav={subNav}
      padding="none"
    >
      <ContentSection tone="white" padding="subNav">
        <HTMLViewer
          html={description}
          image={
            imageURL && {
              src: imageURL,
              width: 240,
              height: 360,
              mobileFullWidth: true,
            }
          }
        />
      </ContentSection>
    </PageLayout>
  );
}
