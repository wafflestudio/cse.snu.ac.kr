import { createFileRoute } from '@tanstack/react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { usePeopleSubNav } from '~/hooks/useSubNav';
import PeopleGrid, {
  type PeopleCardContentItem,
  type PeopleCardProps,
} from '~/routes/{-$locale}/people/components/PeopleGrid';
import type { SimpleStaff } from '~/types/api/v2/staff';

const META = {
  ko: {
    title: '행정직원',
    description:
      '서울대학교 컴퓨터공학부 행정직원을 소개합니다. 학사 업무, 행정 지원, 시설 관리 등을 담당하는 직원들의 연락처와 업무 정보를 확인하실 수 있습니다.',
  },
  en: {
    title: 'Staff',
    description:
      'Administrative staff of the Department of Computer Science and Engineering at Seoul National University. Find contact information and roles of staff members handling academic affairs, administration, and facility management.',
  },
};

function StaffPage() {
  const staffList = Route.useLoaderData();

  const { t, localizedPath, locale } = useLanguage({
    행정직원: 'Staff',
    구성원: 'People',
  });
  const subNav = usePeopleSubNav();
  const meta = META[locale];

  const items = staffList.map((staff) => toCard(staff, localizedPath));

  return (
    <PageLayout
      title={t('행정직원')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
      noImageIndex
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-7 flex justify-end">
          <Button
            kind="action"
            size="md"
            as="link"
            to={localizedPath('/people/staff/create')}
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
  staff: SimpleStaff,
  localizedPath: (path: string) => string,
): PeopleCardProps => {
  const content: PeopleCardContentItem[] = [
    { text: staff.office },
    { text: staff.phone },
    { text: staff.email, href: `mailto:${staff.email}` },
  ];

  return {
    id: staff.id,
    imageURL: staff.imageURL,
    name: staff.name,
    subtitle: staff.role,
    titleNewline: true,
    href: localizedPath(`/people/staff/${staff.id}`),
    content,
  };
};

export const Route = createFileRoute('/{-$locale}/people/staff/')({
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const response = await fetch(`${BASE_URL}/v2/staff?language=${locale}`);
    if (!response.ok) throw new Error('Failed to fetch staff list');

    return (await response.json()) as SimpleStaff[];
  },
  component: StaffPage,
});
