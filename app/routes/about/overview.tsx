import type { Route } from '.react-router/types/app/routes/about/+types/overview';
import Attachments from '~/components/common/Attachments';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import commonTranslations from '~/translations.json';
import type { AboutContent } from '~/types/api/v2';
import { getLocaleFromPathname } from '~/utils/string';
import brochure1 from './assets/brochure1.png';
import brochure2 from './assets/brochure2.png';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `https://cse.snu.ac.kr/api/v2/about/overview?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch overview data');

  return (await response.json()) as AboutContent;
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const { description, attachments, imageURL } = loaderData;
  const { t } = useLanguage({
    ...commonTranslations,
    '학부 소개 책자': 'Department Brochure',
  });

  return (
    <PageLayout
      title={t('학부 소개')}
      breadcrumb={[
        { name: t('소개'), path: '/about' },
        { name: t('학부 소개'), path: '/about/overview' },
      ]}
      titleType="big"
      removePadding
      subNav={{
        title: t('소개'),
        titlePath: '/about/overview',
        items: [
          { name: t('학부 소개'), path: '/about/overview', depth: 1 },
          { name: t('학부장 인사말'), path: '/about/greetings', depth: 1 },
          { name: t('연혁'), path: '/about/history', depth: 1 },
          { name: t('졸업생 진로'), path: '/about/future-careers', depth: 1 },
          { name: t('동아리 소개'), path: '/about/student-clubs', depth: 1 },
          { name: t('시설 안내'), path: '/about/facilities', depth: 1 },
          { name: t('연락처'), path: '/about/contact', depth: 1 },
          { name: t('찾아오는 길'), path: '/about/directions', depth: 1 },
        ],
      }}
    >
      <div className="bg-neutral-100 px-5 pb-12 pt-7 sm:py-11 sm:pl-25 sm:pr-90">
        <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:gap-10">
          <HTMLViewer
            htmlContent={description}
            wrapperClassName="sm:w-[20rem] sm:grow"
          />
          {imageURL && (
            <div className="w-full sm:w-auto">
              <img
                src={imageURL}
                alt="학교 전경"
                width={320}
                height={216}
                className="w-full object-contain sm:w-80"
              />
            </div>
          )}
        </div>
      </div>
      <div className="bg-white px-5 pb-16 pt-10 sm:pb-[7.88rem] sm:pl-25 sm:pr-90">
        <h2 className="mb-6 text-base font-semibold">{t('학부 소개 책자')}</h2>
        <div className="mb-10 flex flex-col gap-6 sm:flex-row">
          <img src={brochure1} width={227} height={320} alt="소개 책자" />
          <img src={brochure2} width={227} height={320} alt="소개 책자" />
        </div>
        <Attachments files={attachments} />
      </div>
    </PageLayout>
  );
}
