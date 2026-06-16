import { Link } from '@tanstack/react-router';
import { useLanguage } from '~/hooks/useLanguage';

interface ScholarshipListProps {
  scholarships: { id: number; name: string }[];
  studentType: 'undergraduate' | 'graduate';
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
    <div className="mt-10 flex flex-col">
      <h3 className="border-b border-b-neutral-200 pb-2 text-[20px] font-bold leading-10">
        {t('장학금 종류')}
      </h3>
      <ul className="mt-4">
        {scholarships.map((item) => (
          <li key={item.id} className="w-fit py-2">
            <Link
              to={localizedPath(
                `/academics/${studentType}/scholarship/${item.id}`,
              )}
              className="group flex items-center gap-2.5 px-3"
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-full border border-main-orange duration-300 group-hover:bg-main-orange" />
              <span className="text-md font-medium duration-300 group-hover:text-main-orange">
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
