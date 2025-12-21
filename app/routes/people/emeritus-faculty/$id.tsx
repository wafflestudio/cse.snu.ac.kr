import type { Route } from '.react-router/types/app/routes/people/emeritus-faculty/+types/$id';
import type { LoaderFunctionArgs } from 'react-router';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import PeopleContactList from '~/routes/people/components/PeopleContactList';
import PeopleInfoList from '~/routes/people/components/PeopleInfoList';
import PeopleProfileImage from '~/routes/people/components/PeopleProfileImage';
import type { EmeritusFaculty, WithLanguage } from '~/types/api/v2/professor';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const id = Number(params.id);
  if (Number.isNaN(id)) throw new Error('Invalid emeritus faculty id');

  const response = await fetch(`${BASE_URL}/v2/professor/${id}`);
  if (!response.ok) throw new Error('Failed to fetch emeritus faculty');

  const data = (await response.json()) as WithLanguage<EmeritusFaculty>;
  return data[locale];
}

export default function EmeritusFacultyDetailPage({
  loaderData: faculty,
}: Route.ComponentProps) {
  const { t } = useLanguage({
    '역대 교수진': 'Emeritus Faculty',
    구성원: 'People',
    연락처: 'Contact',
    교수실: 'Office',
    이메일: 'Email',
    웹사이트: 'Website',
    학력: 'Education',
    '연구 분야': 'Research Areas',
    '재직 기간': 'Service Period',
  });

  const contactItems = [];

  if (faculty.office)
    contactItems.push({ label: t('교수실'), value: faculty.office });

  if (faculty.email)
    contactItems.push({
      label: t('이메일'),
      value: faculty.email,
      href: `mailto:${faculty.email}`,
    });

  if (faculty.website)
    contactItems.push({
      label: t('웹사이트'),
      value: faculty.website,
      href: faculty.website,
    });

  const careerTimeStr = `${t('재직 기간')}: ${faculty.startDate} - ${faculty.endDate}`;

  return (
    <PageLayout
      title={faculty.name}
      subtitle={faculty.academicRank}
      titleSize="xl"
      breadcrumb={[
        { name: t('구성원'), path: '/people' },
        { name: t('역대 교수진'), path: '/people/emeritus-faculty' },
      ]}
    >
      <div className="relative mb-10 flex flex-col items-start sm:flex-row sm:gap-15">
        <PeopleProfileImage imageURL={faculty.imageURL} />
        <div className="mt-6 sm:mt-0">
          <PeopleContactList title={t('연락처')} items={contactItems} />
          <PeopleInfoList header={t('학력')} items={faculty.educations} />
          <PeopleInfoList
            header={t('연구 분야')}
            items={faculty.researchAreas}
          />
          <div className="mb-7 text-sm font-medium text-neutral-700">
            {careerTimeStr}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
