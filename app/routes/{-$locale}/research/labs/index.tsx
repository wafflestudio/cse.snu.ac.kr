import { createFileRoute } from '@tanstack/react-router';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { useResearchSubNav } from '@/hooks/useSubNav';
import ResearchLabListRow from '@/routes/{-$locale}/research/labs/components/ResearchLabRow';
import type { SimpleResearchLab } from '@/types/api/v2/research/labs';

const META = {
  ko: {
    title: '연구실 목록',
    description:
      '서울대학교 컴퓨터공학부의 연구실을 소개합니다. 다양한 컴퓨터 과학 및 공학 분야의 연구실 정보와 지도교수, 연락처를 확인하실 수 있습니다.',
  },
  en: {
    title: 'Laboratories',
    description:
      'Research laboratories of the Department of Computer Science and Engineering at Seoul National University. Find lab information, professors, and contact details.',
  },
};

function ResearchLabsPage() {
  const labs = Route.useLoaderData();

  const { t, localizedPath, locale } = useLanguage({
    '연구실 목록': 'Laboratories',
    연구·교육: 'Research & Edu',
    연구실: 'Lab',
    지도교수: 'Professor',
    '연구실 위치': 'Location',
    전화: 'Tel',
    약자: 'Acronym',
    '소개 자료': 'Materials',
  });
  const subNav = useResearchSubNav();
  const meta = META[locale];

  return (
    <PageLayout
      title={t('연구실 목록')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-9 text-right">
          <Button
            as="link"
            to={localizedPath('/research/labs/create')}
            variant="primary"
            size="md"
          >
            연구실 추가
          </Button>
        </div>
      </LoginVisible>

      <div className="sm:border-y sm:border-neutral-200">
        <h4 className="hidden h-10 items-center gap-2 whitespace-nowrap bg-neutral-100 px-2 text-sm font-medium tracking-[0.02em] sm:flex">
          <span className={LAB_ROW_ITEM_WIDTH.name}>{t('연구실')}</span>
          <span className={LAB_ROW_ITEM_WIDTH.professor}>{t('지도교수')}</span>
          <span className={LAB_ROW_ITEM_WIDTH.location}>
            {t('연구실 위치')}
          </span>
          <span className={LAB_ROW_ITEM_WIDTH.tel}>{t('전화')}</span>
          <span className={LAB_ROW_ITEM_WIDTH.acronym}>{t('약자')}</span>
          <span className={LAB_ROW_ITEM_WIDTH.introMaterial}>
            {t('소개 자료')}
          </span>
        </h4>

        <ul className="sm:divide-y sm:divide-dashed sm:divide-neutral-200">
          {labs.map((lab) => (
            <ResearchLabListRow
              key={lab.id}
              lab={lab}
              localizedPath={localizedPath}
              labelProfessor={t('지도교수')}
            />
          ))}
        </ul>
      </div>
    </PageLayout>
  );
}

export const LAB_ROW_ITEM_WIDTH = {
  name: 'sm:w-[14.5rem]',
  professor: 'sm:w-[6.875rem]',
  location: 'sm:w-[12.5rem]',
  tel: 'sm:w-[7.5rem]',
  acronym: 'sm:w-20',
  introMaterial: 'sm:w-[5.625rem]',
} as const;

export const Route = createFileRoute('/{-$locale}/research/labs/')({
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const query = new URLSearchParams();
    query.append('language', locale);

    const response = await fetch(
      `${BASE_URL}/v2/research/lab?${query.toString()}`,
    );
    if (!response.ok) throw new Error('Failed to fetch research labs');

    return (await response.json()) as SimpleResearchLab[];
  },
  component: ResearchLabsPage,
});
