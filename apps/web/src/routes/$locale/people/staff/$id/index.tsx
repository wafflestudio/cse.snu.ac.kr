import { createFileRoute } from '@tanstack/react-router';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { usePeopleSubNav } from '@/hooks/useSubNav';
import PeopleDetailLayout from '@/routes/$locale/people/-components/PeopleDetailLayout';
import PeopleInfoList from '@/routes/$locale/people/-components/PeopleInfoList';
import type { StaffWithLanguage } from '@/types/api';
import { api } from '@/utils/api';

function StaffDetailPage() {
  const staff = Route.useLoaderData();

  const { t, localizedPath, locale } = useLanguage({
    구성원: 'People',
    행정직원: 'Staff',
    연락처: 'Contact',
    위치: 'Office',
    전화: 'Phone',
    이메일: 'Email',
    '주요 업무': 'Tasks',
  });

  const subNav = usePeopleSubNav();

  // 동적 메타데이터 생성
  const pageTitle =
    locale === 'en' ? `${staff.name} ⋅ Staff` : `${staff.name} ⋅ 행정직원`;

  const pageDescription =
    locale === 'en'
      ? `${staff.name}, ${staff.role} - Seoul National University Department of Computer Science and Engineering`
      : `${staff.name} ${staff.role} - 서울대학교 컴퓨터공학부`;

  const contactItems = [
    { icon: 'distance', label: staff.office },
    { icon: 'phone_in_talk', label: staff.phone },
    {
      icon: 'mail',
      label: staff.email,
      href: staff.email ? `mailto:${staff.email}` : undefined,
    },
  ];

  return (
    <PageLayout
      title={staff.name}
      subtitle={staff.role}
      subNav={subNav}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      noImageIndex
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 text-right">
          <Button
            as="link"
            to={localizedPath(`/people/staff/${staff.id}/edit`)}
            variant="secondary"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>

      <PeopleDetailLayout imageURL={staff.imageURL} contacts={contactItems}>
        <PeopleInfoList header={t('주요 업무')} items={staff.tasks} />
      </PeopleDetailLayout>
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/people/staff/$id/')({
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const id = Number(params.id);
    if (Number.isNaN(id)) throw new Error('Invalid staff id');

    const data = await api.get(`v2/staff/${id}`).json<StaffWithLanguage>();
    const translation = data[locale];
    if (!translation) throw new Error('Staff translation not found');
    // 표시용으로 공유값과 해당 언어값을 합쳐 넘긴다.
    return { ...data, ...translation };
  },
  component: StaffDetailPage,
});
