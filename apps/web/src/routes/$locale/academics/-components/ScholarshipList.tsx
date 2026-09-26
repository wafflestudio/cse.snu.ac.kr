import DotLinkList from '@/components/ui/DotLinkList';
import { useLanguage } from '@/hooks/useLanguage';
import type { StudentType } from '@/types/api';

interface ScholarshipListProps {
  scholarships: { id: number; name: string }[];
  studentType: StudentType;
}

const translations = {
  '장학금 종류': 'Types of Scholarships',
};

export default function ScholarshipList({
  scholarships,
  studentType,
}: ScholarshipListProps) {
  const { t, localizedPath } = useLanguage(translations);

  return (
    <div className="mt-12 flex flex-col">
      <h3 className="border-b border-b-neutral-200 pb-4 type-section">
        {t('장학금 종류')}
      </h3>
      <div className="mt-4">
        <DotLinkList
          items={scholarships.map((item) => ({
            key: item.id,
            to: localizedPath(
              `/academics/${studentType}/scholarship/${item.id}`,
            ),
            label: item.name,
          }))}
        />
      </div>
    </div>
  );
}
