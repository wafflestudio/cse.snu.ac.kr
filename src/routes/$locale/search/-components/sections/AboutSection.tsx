import { useLanguage } from '@/hooks/useLanguage';
import type { AboutPreview, AboutSearchResult } from '@/types/api';
import BasicRow from '../ui/BasicRow';
import Section from '../ui/Section';

type TranslationKey = keyof typeof import('@/translations.json');

const ABOUT_PATHS: Record<AboutPreview['aboutPostType'], string> = {
  overview: '/about/overview',
  greetings: '/about/greetings',
  history: '/about/history',
  'future-careers': '/about/future-careers',
  'student-clubs': '/about/student-clubs',
  facilities: '/about/facilities',
  contact: '/about/contact',
  directions: '/about/directions',
};

const ABOUT_LABELS: Record<AboutPreview['aboutPostType'], TranslationKey> = {
  overview: '학부 소개',
  greetings: '학부장 인사말',
  history: '연혁',
  'future-careers': '졸업생 진로',
  'student-clubs': '동아리 소개',
  facilities: '시설 안내',
  contact: '연락처',
  directions: '찾아오는 길',
};

export default function AboutSection({ about }: { about: AboutSearchResult }) {
  const { t } = useLanguage();
  return (
    <Section title="소개" size={about.total} sectionId="about">
      <div className="flex flex-col gap-9">
        {about.results.map((result) => {
          const path = ABOUT_PATHS[result.aboutPostType];
          const itemLabel = ABOUT_LABELS[result.aboutPostType];
          const metaLabel = `${t('소개')} > ${t(itemLabel)}`;

          return (
            <BasicRow
              key={result.id}
              href={path}
              title={t(itemLabel)}
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
