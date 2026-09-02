import { useLanguage } from '@/hooks/useLanguage';
import type { ResearchSearchResult, ResearchType } from '@/types/api';
import BasicRow from '../ui/BasicRow';
import Section from '../ui/Section';

type TranslationKey = keyof typeof import('@/translations.json');

export default function ResearchSection({
  research,
}: {
  research: ResearchSearchResult;
}) {
  const { t } = useLanguage();

  return (
    <Section title="연구·교육" size={research.total} sectionId="research">
      <div className="flex flex-col gap-7">
        {research.results.map((result) => {
          const href = toResearchUrl(
            result.researchType,
            result.id,
            result.name,
          );
          const basePath = toResearchBasePath(result.researchType);
          const itemLabel = toResearchLabel(result.researchType);
          const metaLabel = `${t('연구·교육')} > ${t(itemLabel)}`;

          return (
            <BasicRow
              key={result.id}
              href={href}
              title={result.name}
              metaLabel={metaLabel}
              metaHref={basePath}
              partialDescription={result.partialDescription}
              boldStartIndex={result.boldStartIdx}
              boldEndIndex={result.boldEndIdx}
            />
          );
        })}
      </div>
    </Section>
  );
}

const toResearchLabel = (researchType: ResearchType): TranslationKey => {
  switch (researchType) {
    case 'conference':
      return 'Top Conference List';
    case 'lab':
      return '연구실 목록';
    case 'research-center':
      return '연구 센터';
    case 'research-group':
      return '연구·교육 스트림';
  }
};

const toResearchBasePath = (researchType: ResearchType) => {
  switch (researchType) {
    case 'conference':
      return '/research/top-conference-list';
    case 'lab':
      return '/research/labs';
    case 'research-center':
      return '/research/centers';
    case 'research-group':
      return '/research/groups';
  }
};

const toResearchUrl = (
  researchType: ResearchType,
  id: number,
  name: string,
) => {
  switch (researchType) {
    case 'conference':
      return '/research/top-conference-list';
    case 'lab':
      return `/research/labs/${id}`;
    case 'research-center':
      return `/research/centers?selected=${encodeURIComponent(name)}`;
    case 'research-group':
      return `/research/groups?selected=${encodeURIComponent(name)}`;
  }
};
