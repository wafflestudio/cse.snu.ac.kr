import { createFileRoute } from '@tanstack/react-router';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { usePeopleSubNav } from '@/hooks/useSubNav';
import PeopleGrid, {
  type PeopleCardContentItem,
  type PeopleCardProps,
} from '@/routes/{-$locale}/people/components/PeopleGrid';
import type { SimpleEmeritusFaculty } from '@/types/api/v2/professor';

const META = {
  ko: {
    title: '명예교수',
    description:
      '서울대학교 컴퓨터공학부의 명예교수를 소개합니다. 학부 발전에 기여하신 은퇴 교수님들의 업적과 연락처 정보를 확인하실 수 있습니다.',
  },
  en: {
    title: 'Emeritus Faculty',
    description:
      'Emeritus faculty of the Department of Computer Science and Engineering at Seoul National University. Learn about the achievements and contact information of retired professors who contributed to the department.',
  },
};

function EmeritusFacultyPage() {
  const loaderData = Route.useLoaderData();

  const { t, localizedPath, locale } = useLanguage({
    '역대 교수진': 'Emeritus Faculty',
    구성원: 'People',
  });
  const subNav = usePeopleSubNav();
  const meta = META[locale];

  const items = loaderData.map((faculty) => toCard(faculty, localizedPath));

  return (
    <PageLayout
      title={t('역대 교수진')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-7 flex justify-end">
          <Button
            kind="action"
            size="md"
            as="link"
            to={localizedPath('/people/faculty/create?status=INACTIVE')}
          >
            추가하기
          </Button>
        </div>
      </LoginVisible>

      <PeopleGrid items={items} />
    </PageLayout>
  );
}

const toCard = (
  faculty: SimpleEmeritusFaculty,
  localizedPath: (path: string) => string,
): PeopleCardProps => {
  const content: PeopleCardContentItem[] = [];
  if (faculty.email) {
    content.push({ text: faculty.email, href: `mailto:${faculty.email}` });
  }

  return {
    id: faculty.id,
    imageURL: faculty.imageURL,
    name: faculty.name,
    subtitle: faculty.academicRank,
    href: localizedPath(`/people/emeritus-faculty/${faculty.id}`),
    content,
  };
};

export const Route = createFileRoute('/{-$locale}/people/emeritus-faculty/')({
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const response = await fetch(
      `${BASE_URL}/v2/professor/inactive?language=${locale}`,
    );
    if (!response.ok) throw new Error('Failed to fetch emeritus faculty list');

    return (await response.json()) as SimpleEmeritusFaculty[];
  },
  component: EmeritusFacultyPage,
});
