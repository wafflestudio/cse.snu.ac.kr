import type { Route } from '.react-router/types/app/routes/people/faculty/+types';
import { useState } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { usePeopleSubNav } from '~/hooks/useSubNav';
import type { FacultyList, SimpleFaculty } from '~/types/api/v2/professor';
import { getLocaleFromPathname } from '~/utils/string';
import PeopleGrid, {
  type PeopleCardContentItem,
  type PeopleCardProps,
} from '../components/PeopleGrid';

type SortType = 'name' | 'department';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(
    `${BASE_URL}/v2/professor/active?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch faculty list');

  return (await response.json()) as FacultyList;
}

const META = {
  ko: {
    title: '교수진',
    description:
      '서울대학교 컴퓨터공학부 교수진을 소개합니다. 다양한 컴퓨터 과학 및 공학 분야에서 활발히 연구하는 세계적 수준의 교수진을 만나보세요.',
  },
  en: {
    title: 'Faculty',
    description:
      'Meet the faculty members of the Department of Computer Science and Engineering at Seoul National University. Explore our world-class professors conducting cutting-edge research.',
  },
};

export default function FacultyPage({
  loaderData: data,
}: Route.ComponentProps) {
  const { t, localizedPath, locale } = useLanguage({
    교수진: 'Faculty',
    구성원: 'People',
    객원교수: 'Visiting Professors',
    가나다순: 'Name',
    소속순: 'Department',
  });
  const subNav = usePeopleSubNav();
  const meta = META[locale];
  const [sortType, setSortType] = useState<SortType>('name');

  const sortProfessors = (professors: SimpleFaculty[]) => {
    if (sortType === 'name') {
      return [...professors].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    } else {
      return [...professors].sort((a, b) => {
        const deptA = a.department || '';
        const deptB = b.department || '';

        // 컴퓨터공학부가 맨 앞
        if (deptA === '컴퓨터공학부' && deptB !== '컴퓨터공학부') return -1;
        if (deptA !== '컴퓨터공학부' && deptB === '컴퓨터공학부') return 1;

        // 나머지는 가나다 역순
        return deptB.localeCompare(deptA, 'ko');
      });
    }
  };

  const normalProfessors = data.professors.filter(
    (professor) => professor.status !== 'VISITING',
  );
  const visitingProfessors = data.professors.filter(
    (professor) => professor.status === 'VISITING',
  );

  const normal = sortProfessors(normalProfessors).map((professor) =>
    toCard(professor, localizedPath),
  );
  const visiting = sortProfessors(visitingProfessors).map((professor) =>
    toCard(professor, localizedPath),
  );

  return (
    <PageLayout
      title={t('교수진')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <div className="mb-7 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="solid"
            tone={sortType === 'name' ? 'inverse' : 'neutral'}
            size="md"
            onClick={() => setSortType('name')}
          >
            {t('가나다순')}
          </Button>
          <Button
            variant="solid"
            tone={sortType === 'department' ? 'inverse' : 'neutral'}
            size="md"
            onClick={() => setSortType('department')}
          >
            {t('소속순')}
          </Button>
        </div>
        <LoginVisible allow="ROLE_STAFF">
          <Button
            variant="solid"
            tone="inverse"
            size="md"
            as="link"
            to={localizedPath('/people/faculty/create')}
          >
            추가하기
          </Button>
        </LoginVisible>
      </div>

      <PeopleGrid items={normal} />
      {visiting.length > 0 && (
        <>
          <h3 className="mb-4 mt-12 text-[20px] font-bold">{t('객원교수')}</h3>
          <PeopleGrid items={visiting} />
        </>
      )}
    </PageLayout>
  );
}

const toCard = (
  professor: SimpleFaculty,
  localizedPath: (path: string) => string,
): PeopleCardProps => {
  const content: PeopleCardContentItem[] = [];

  if (professor.labName && professor.labId) {
    content.push({
      text: professor.labName,
      href: localizedPath(`/research/labs/${professor.labId}`),
    });
  }

  if (professor.phone) content.push({ text: professor.phone });

  if (professor.email) {
    content.push({ text: professor.email, href: `mailto:${professor.email}` });
  }

  return {
    id: professor.id,
    imageURL: professor.imageURL,
    name: professor.name,
    subtitle: professor.academicRank,
    href: localizedPath(`/people/faculty/${professor.id}`),
    content,
  };
};
