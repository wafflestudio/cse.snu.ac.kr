import { createFileRoute } from '@tanstack/react-router';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { useAboutSubNav } from '@/hooks/useSubNav';
import { processHtmlForCsp } from '@/serverFns/processHtmlForCsp';
import type { FacilitiesResponse } from '@/types/api';
import { api } from '@/utils/api';
import FacilitiesList from './-components/FacilitiesList';

const META = {
  ko: {
    title: '시설 안내',
    description:
      '서울대학교 컴퓨터공학부의 주요 시설을 소개합니다. 강의실, 연구실, 세미나실 등 학부 내 다양한 시설 정보를 확인하실 수 있습니다.',
  },
  en: {
    title: 'Facilities',
    description:
      'Facilities of the Department of Computer Science and Engineering at Seoul National University. Find information about classrooms, labs, seminar rooms, and other facilities.',
  },
};

function FacilitiesPage() {
  const facilities = Route.useLoaderData();

  const { t, localizedPath, locale } = useLanguage({
    '시설 안내': 'Facilities',
  });
  const subNav = useAboutSubNav();
  const meta = META[locale];

  return (
    <PageLayout
      title={t('시설 안내')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-7 text-right">
          <Button
            as="link"
            to={localizedPath('/about/facilities/create')}
            variant="primary"
            size="md"
          >
            시설 추가
          </Button>
        </div>
      </LoginVisible>
      <FacilitiesList facilities={facilities} />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/about/facilities/')({
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const facilities = await api
      .get(`v2/about/facilities`)
      .json<FacilitiesResponse>();
    // 표시용으로 공유값(id·사진)과 해당 언어값을 합쳐 넘긴다.
    return Promise.all(
      facilities.map(async (facility) => {
        const translation = facility[locale];
        if (!translation) throw new Error('시설 번역본이 없습니다.');
        return {
          id: facility.id,
          imageURL: facility.imageURL,
          ...translation,
          description: await processHtmlForCsp({
            data: translation.description,
          }),
        };
      }),
    );
  },
  component: FacilitiesPage,
});
