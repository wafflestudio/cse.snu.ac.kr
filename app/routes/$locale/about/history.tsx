import { createFileRoute } from '@tanstack/react-router';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import ContentSection from '@/components/feature/content/ContentSection';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import HTMLViewer from '@/components/ui/HTMLViewer';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { useAboutSubNav } from '@/hooks/useSubNav';
import type { AboutContent } from '@/types/api/v2/about/content';
import { processHtmlForCsp } from '@/utils/cspServerFn';

const META = {
  ko: {
    title: '연혁',
    description:
      '서울대학교 컴퓨터공학부의 역사와 발전 과정을 소개합니다. 1963년 응용수학과부터 시작하여 2000년 컴퓨터공학부 설립까지의 주요 발자취를 확인하실 수 있습니다.',
  },
  en: {
    title: 'History',
    description:
      'History and development of the Department of Computer Science and Engineering at Seoul National University, from its origins in 1963 to the establishment of the department in 2000.',
  },
};

function HistoryPage() {
  const loaderData = Route.useLoaderData();

  const { t, localizedPath, locale } = useLanguage();
  const subNav = useAboutSubNav();
  const meta = META[locale];

  return (
    <PageLayout
      title={t('연혁')}
      titleSize="xl"
      subNav={subNav}
      padding="none"
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <ContentSection tone="white" padding="subNav">
        <LoginVisible allow="ROLE_STAFF">
          <div className="mb-8 text-right">
            <Button
              as="link"
              to={localizedPath('/about/history/edit')}
              variant="secondary"
              size="md"
            >
              편집
            </Button>
          </div>
        </LoginVisible>
        <HTMLViewer
          html={loaderData.description}
          image={
            loaderData.imageURL && {
              src: loaderData.imageURL,
              width: 320,
              height: 360,
              mobileFullWidth: true,
            }
          }
        />
      </ContentSection>
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/about/history')({
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const response = await fetch(
      `${BASE_URL}/v2/about/history?language=${locale}`,
    );
    if (!response.ok) throw new Error('Failed to fetch history');

    const data = (await response.json()) as AboutContent;

    return {
      ...data,
      description: await processHtmlForCsp(data.description),
    };
  },
  component: HistoryPage,
});
