import type { Route } from '.react-router/types/app/routes/people/staff/+types/$id';
import type { LoaderFunctionArgs } from 'react-router';
import Button from '~/components/common/Button';
import LoginVisible from '~/components/common/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import PeopleContactList from '~/routes/people/components/PeopleContactList';
import PeopleInfoList from '~/routes/people/components/PeopleInfoList';
import PeopleProfileImage from '~/routes/people/components/PeopleProfileImage';
import type { Staff } from '~/types/api/v2/staff';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const id = Number(params.id);
  if (Number.isNaN(id)) throw new Error('Invalid staff id');

  const response = await fetch(`${BASE_URL}/v2/staff/${id}`);
  if (!response.ok) throw new Error('Failed to fetch staff');

  const data = (await response.json()) as { ko: Staff; en: Staff };
  return data[locale];
}

export default function StaffDetailPage({
  loaderData: staff,
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage({
    구성원: 'People',
    행정직원: 'Staff',
    연락처: 'Contact',
    위치: 'Office',
    전화: 'Phone',
    이메일: 'Email',
    '주요 업무': 'Tasks',
  });

  const contactItems = [
    { label: t('위치'), value: staff.office },
    { label: t('전화'), value: staff.phone },
    {
      label: t('이메일'),
      value: staff.email,
      href: `mailto:${staff.email}`,
    },
  ];

  return (
    <PageLayout
      title={staff.name}
      subtitle={staff.role}
      titleSize="xl"
      breadcrumb={[
        { name: t('구성원'), path: '/people' },
        { name: t('행정직원'), path: '/people/staff' },
      ]}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-9 text-right">
          <Button
            as="link"
            to={localizedPath(`/people/staff/${staff.id}/edit`)}
            variant="outline"
            tone="neutral"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>

      <div className="relative mb-32 flex flex-col items-start sm:flex-row sm:gap-15">
        <PeopleProfileImage imageURL={staff.imageURL} />
        <div className="mt-6 sm:mt-0">
          <PeopleContactList title={t('연락처')} items={contactItems} />
          <PeopleInfoList header={t('주요 업무')} items={staff.tasks} />
        </div>
      </div>
    </PageLayout>
  );
}
