import type { Route } from '.react-router/types/app/routes/people/emeritus-faculty/+types/index';
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
import type { SimpleEmeritusFaculty } from '~/types/api/v2/professor';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(
    `${BASE_URL}/v2/professor/inactive?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch emeritus faculty list');

  return (await response.json()) as SimpleEmeritusFaculty[];
}

export default function EmeritusFacultyPage({
  loaderData,
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage({
    '역대 교수진': 'Emeritus Faculty',
    구성원: 'People',
  });
  const subNav = usePeopleSubNav();

  const items = loaderData.map((faculty) => toCard(faculty, localizedPath));

  return (
    <PageLayout
      title={t('역대 교수진')}
      titleSize="xl"
      breadcrumb={[
        { name: t('구성원'), path: '/people' },
        { name: t('역대 교수진'), path: '/people/emeritus-faculty' },
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

  const subtitle = faculty.department
    ? `${faculty.academicRank}, ${faculty.department}`
    : faculty.academicRank;

  return {
    id: faculty.id,
    imageURL: faculty.imageURL,
    name: faculty.name,
    subtitle,
    href: localizedPath(`/people/emeritus-faculty/${faculty.id}`),
    content,
  };
};
