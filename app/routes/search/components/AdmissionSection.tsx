import { useLanguage } from '~/hooks/useLanguage';
import type { AdmissionsSearchResult } from '~/types/api/v2/search';
import { SEARCH_TRANSLATIONS } from '../constants';
import BasicRow from './BasicRow';
import Section from './Section';

export default function AdmissionSection({
  admission,
}: {
  admission: AdmissionsSearchResult;
}) {
  const { tUnsafe } = useLanguage(SEARCH_TRANSLATIONS);

  return (
    <Section title="입학" size={admission.total} sectionId="admissions">
      <div className="flex flex-col gap-7">
        {admission.admissions.map((result) => {
          const path = toAdmissionPath(result.mainType, result.postType);
          const { mainLabel, postLabel } = toAdmissionLabels(
            result.mainType,
            result.postType,
          );

          return (
            <BasicRow
              key={result.id}
              href={path}
              title={result.name}
              metaLabel={`${tUnsafe(mainLabel)} > ${tUnsafe(postLabel)}`}
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

const MAIN_TYPE_LABELS: Record<string, string> = {
  UNDERGRADUATE: '학부',
  GRADUATE: '대학원',
  INTERNATIONAL: 'International',
};

const POST_TYPE_LABELS: Record<string, string> = {
  EARLY_ADMISSION: '수시 모집',
  REGULAR_ADMISSION: '정시 모집',
  UNDERGRADUATE: 'Undergraduate',
  GRADUATE: 'Graduate',
  EXCHANGE: 'Exchange/Visiting Program',
  SCHOLARSHIPS: 'Scholarships',
};

const toAdmissionLabels = (mainType: string, postType: string) => {
  const mainLabel = MAIN_TYPE_LABELS[mainType] ?? mainType;
  const postLabel =
    mainType === 'GRADUATE' && postType === 'REGULAR_ADMISSION'
      ? '전기/후기 모집'
      : (POST_TYPE_LABELS[postType] ?? postType);

  return { mainLabel, postLabel };
};

const toAdmissionPath = (mainType: string, postType: string) => {
  const normalize = (value: string) => value.toLowerCase().replaceAll('_', '-');
  return `/admissions/${normalize(mainType)}/${normalize(postType)}`;
};
