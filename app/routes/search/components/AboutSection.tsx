import { useLanguage } from '~/hooks/useLanguage';
import type { AboutPreview, AboutSearchResult } from '~/types/api/v2/search';
import { SEARCH_TRANSLATIONS } from '../constants';
import BasicRow from './BasicRow';
import Section from './Section';

const ABOUT_PATHS: Record<AboutPreview['aboutPostType'], string> = {
  OVERVIEW: '/about/overview',
  GREETINGS: '/about/greetings',
  HISTORY: '/about/history',
  FUTURE_CAREERS: '/about/future-careers',
  STUDENT_CLUBS: '/about/student-clubs',
  FACILITIES: '/about/facilities',
  CONTACT: '/about/contact',
  DIRECTIONS: '/about/directions',
};

export default function AboutSection({ about }: { about: AboutSearchResult }) {
  const { t } = useLanguage(SEARCH_TRANSLATIONS);
  return (
    <Section title="소개" size={about.total} sectionId="about">
      <div className="flex flex-col gap-9">
        {about.results.map((result) => {
          const path = ABOUT_PATHS[result.aboutPostType];
          const metaLabel = `${t('학부 소개')} > ${result.name}`;

          return (
            <BasicRow
              key={result.id}
              href={path}
              title={result.name}
              metaLabel={metaLabel}
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
