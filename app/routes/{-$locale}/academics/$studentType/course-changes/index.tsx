import { createFileRoute } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { useAcademicsSubNav } from '@/hooks/useSubNav';
import TimelineViewer from '@/routes/{-$locale}/academics/components/timeline/TimelineViewer';
import type { TimelineContent } from '@/types/api/v2/academics';
import { processHtmlForCsp } from '@/utils/cspServerFn';
import { fetchJson } from '@/utils/fetch';

const META = {
  undergraduate: {
    ko: {
      title: '교과목 변경 내역',
      description:
        '서울대학교 컴퓨터공학부 학부 교과목 변경 내역을 안내합니다. 학년도별 교과목 개설, 폐지, 변경 사항을 확인하실 수 있습니다.',
    },
    en: {
      title: 'Course Changes',
      description:
        'Course change history for the undergraduate program at the Department of Computer Science and Engineering, Seoul National University. Find information on course additions, removals, and modifications by academic year.',
    },
  },
  graduate: {
    ko: {
      title: '교과목 변경 내역',
      description:
        '서울대학교 컴퓨터공학부 대학원 교과목 변경 내역을 안내합니다. 학년도별 교과목 개설, 폐지, 변경 사항을 확인하실 수 있습니다.',
    },
    en: {
      title: 'Course Changes',
      description:
        'Course change history for the graduate program at the Department of Computer Science and Engineering, Seoul National University. Find information on course additions, removals, and modifications by academic year.',
    },
  },
};

function CourseChangesPage() {
  const loaderData = Route.useLoaderData();
  const params = Route.useParams();

  const { studentType } = params;
  const { t, locale } = useLanguage({ 학년도: 'Academic Year' });
  const subNav = useAcademicsSubNav();

  const title = t('교과목 변경 내역');
  const meta = META[studentType as 'undergraduate' | 'graduate'][locale];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <TimelineViewer
        contents={loaderData}
        title={{ text: t('교과목 변경 내역'), unit: t('학년도') }}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/{-$locale}/academics/$studentType/course-changes/',
)({
  loader: async ({ params }) => {
    const { studentType } = params;
    const data = await fetchJson<TimelineContent[]>(
      `${BASE_URL}/v2/academics/${studentType}/course-changes`,
    );

    return Promise.all(
      data.map(async (item) => ({
        ...item,
        description: await processHtmlForCsp(item.description),
      })),
    );
  },
  component: CourseChangesPage,
});
