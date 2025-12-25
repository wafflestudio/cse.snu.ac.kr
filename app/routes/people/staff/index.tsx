import type { Route } from '.react-router/types/app/routes/people/staff/+types';
import type { LoaderFunctionArgs } from 'react-router';
import Button from '~/components/common/Button';
import LoginVisible from '~/components/common/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { usePeopleSubNav } from '~/hooks/useSubNav';
import PeopleGrid, {
  type PeopleCardContentItem,
  type PeopleCardProps,
} from '~/routes/people/components/PeopleGrid';
import type { SimpleStaff } from '~/types/api/v2/staff';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(`${BASE_URL}/v2/staff?language=${locale}`);
  if (!response.ok) throw new Error('Failed to fetch staff list');

  return (await response.json()) as SimpleStaff[];
}

export default function StaffPage({
  loaderData: staffList,
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage({
    행정직원: 'Staff',
    구성원: 'People',
  });
  const subNav = usePeopleSubNav();

  const items = staffList.map((staff) => toCard(staff, localizedPath));

  return (
    <PageLayout
      title={t('행정직원')}
      titleSize="xl"
      breadcrumb={[
        { name: t('구성원'), path: '/people' },
        { name: t('행정직원'), path: '/people/staff' },
      ]}
      subNav={subNav}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-7 flex justify-end">
          <Button
            variant="solid"
            tone="inverse"
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
