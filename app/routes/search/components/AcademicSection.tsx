import { useLanguage } from '~/hooks/useLanguage';
import type { Academic, AcademicsSearchResult } from '~/types/api/v2/search';
import { SEARCH_TRANSLATIONS } from '../constants';
import BasicRow from './BasicRow';
import Section from './Section';

export default function AcademicSection({
  academic,
}: {
  academic: AcademicsSearchResult;
}) {
  const { t } = useLanguage(SEARCH_TRANSLATIONS);

  return (
    <Section title="학사 및 교과" size={academic.total} sectionId="academics">
      <div className="flex flex-col gap-7">
        {academic.results.map((result) => {
          const path = toAcademicPath(result);

          return (
            <BasicRow
              key={result.id}
              href={path}
              title={result.name}
              metaLabel={`${t('학사 및 교과')} > ${result.name}`}
              metaHref={path}
              partialDescription={result.partialDescription}
              boldStartIndex={result.boldStartIndex}
              boldEndIndex={result.boldEndIndex}
            />
          );
        })}
      </div>
    </Section>
  );
}

const toAcademicPath = (academic: Academic) => {
  if (academic.academicType === 'GUIDE') {
    return academic.studentType === 'UNDERGRADUATE'
      ? '/academics/undergraduate/guide'
      : '/academics/graduate/guide';
  }

  if (academic.postType === 'COURSE') {
    return academic.studentType === 'UNDERGRADUATE'
      ? '/academics/undergraduate/courses'
      : '/academics/graduate/courses';
  }

  if (academic.academicType === 'COURSE_CHANGES') {
    return academic.studentType === 'UNDERGRADUATE'
      ? '/academics/undergraduate/course-changes'
      : '/academics/graduate/course-changes';
  }

  if (academic.postType === 'SCHOLARSHIP') {
    return academic.studentType === 'UNDERGRADUATE'
      ? '/academics/undergraduate/scholarship'
      : '/academics/graduate/scholarship';
  }

  if (academic.academicType === 'CURRICULUM') {
    return '/academics/undergraduate/curriculum';
  }

  if (
    academic.academicType === 'GENERAL_STUDIES_REQUIREMENTS' ||
    academic.academicType === 'GENERAL_STUDIES_REQUIREMENTS_SUBJECT_CHANGES'
  ) {
    return '/academics/undergraduate/general-studies-requirements';
  }

  if (
    academic.academicType === 'DEGREE_REQUIREMENTS' ||
    academic.academicType === 'DEGREE_REQUIREMENTS_YEAR_LIST'
  ) {
    return '/academics/undergraduate/degree-requirements';
  }

  return '/academics';
};
