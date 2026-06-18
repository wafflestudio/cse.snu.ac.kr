import { createFileRoute } from '@tanstack/react-router';
import clsx from 'clsx';
import { useState } from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { usePeopleSubNav } from '@/hooks/useSubNav';
import type { FacultyList, SimpleFaculty } from '@/types/api/v2/professor';
import PeopleGrid, {
  type PeopleCardContentItem,
  type PeopleCardProps,
} from '../components/PeopleGrid';

type SortType = 'name' | 'department';

// 정렬은 둘 중 하나인 단일 선택 → 토글 버튼이 아니라 radiogroup. 시각은 기존 segmented와 동일
// (선택=action 다크, 비선택=회색). as const로 label을 리터럴 유지(useLanguage `t`가 등록 키만 받음).
const SORT_OPTIONS = [
  { value: 'name', label: '가나다순' },
  { value: 'department', label: '소속순' },
] as const satisfies readonly { value: SortType; label: string }[];

const sortPillClass = (selected: boolean) =>
  clsx(
    'inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-[.0625rem] px-[.875rem] py-[.3125rem] text-md font-medium leading-6 transition duration-200',
    'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-neutral-700',
    selected
      ? 'bg-neutral-700 text-white hover:bg-neutral-500'
      : 'bg-neutral-200 text-neutral-700',
  );

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

function FacultyPage() {
  const data = Route.useLoaderData();

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
      const mainDept =
        locale === 'ko'
          ? '컴퓨터공학부'
          : 'Department of Computer Science and Engineering';
      return [...professors].sort((a, b) => {
        const deptA = a.department || '';
        const deptB = b.department || '';

        // 컴퓨터공학부가 맨 앞
        if (deptA === mainDept && deptB !== mainDept) return -1;
        if (deptA !== mainDept && deptB === mainDept) return 1;

        // 나머지는 가나다 역순, 소속이 같으면 이름순
        const deptOrder = deptB.localeCompare(deptA, 'ko');
        if (deptOrder !== 0) return deptOrder;
        return a.name.localeCompare(b.name, locale);
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
        <fieldset aria-label="정렬" className="m-0 flex gap-2 border-0 p-0">
          {SORT_OPTIONS.map(({ value, label }) => (
            <label key={value} className={sortPillClass(sortType === value)}>
              <input
                type="radio"
                name="faculty-sort"
                value={value}
                checked={sortType === value}
                onChange={() => setSortType(value)}
                className="sr-only"
              />
              {t(label)}
            </label>
          ))}
        </fieldset>
        <LoginVisible allow="ROLE_STAFF">
          <Button
            variant="neutral"
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

export const Route = createFileRoute('/{-$locale}/people/faculty/')({
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const response = await fetch(
      `${BASE_URL}/v2/professor/active?language=${locale}`,
    );
    if (!response.ok) throw new Error('Failed to fetch faculty list');

    return (await response.json()) as FacultyList;
  },
  component: FacultyPage,
});
