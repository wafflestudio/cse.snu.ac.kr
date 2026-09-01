import { useNavigate, useSearch } from '@tanstack/react-router';
import { Tag } from '@/components/ui/Tag';
import { useLanguage } from '@/hooks/useLanguage';
import type {
  SortOption,
  ViewOption,
} from '@/routes/$locale/academics/-constants';
import translations from './translations.json';

interface CourseToolbarProps {
  hideViewOption?: boolean;
  hideSortOption?: boolean;
}

export default function CourseToolbar({
  hideViewOption = false,
  hideSortOption = false,
}: CourseToolbarProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const viewOption = getViewOption(search.view);
  const sortOption = getSortOption(search.sort);

  const changeOption = (
    type: 'view' | 'sort',
    option: ViewOption | SortOption,
  ) => {
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, [type]: option }),
    });
  };

  return (
    <div className="mb-5 flex items-center justify-between sm:pl-5">
      {hideViewOption || (
        <ViewOptions
          selectedOption={viewOption}
          changeOption={(option) => changeOption('view', option)}
        />
      )}
      {hideSortOption || (
        <SortOptions
          selectedOption={sortOption}
          changeOption={(option) => changeOption('sort', option)}
        />
      )}
    </div>
  );
}

interface ViewOptionsProps {
  selectedOption: ViewOption;
  changeOption: (option: ViewOption) => void;
}

function ViewOptions({ selectedOption, changeOption }: ViewOptionsProps) {
  const { t } = useLanguage(translations);

  return (
    <div className="flex gap-3 text-md text-neutral-400">
      <button
        type="button"
        className={
          selectedOption === '목록형' ? 'text-neutral-800' : 'cursor-pointer'
        }
        onClick={() => changeOption('목록형')}
      >
        {t('목록형')}
      </button>
      <span>|</span>
      <button
        type="button"
        className={
          selectedOption === '카드형' ? 'text-neutral-800' : 'cursor-pointer'
        }
        onClick={() => changeOption('카드형')}
      >
        {t('카드형')}
      </button>
    </div>
  );
}

interface SortOptionsProps {
  selectedOption: SortOption;
  changeOption: (option: SortOption) => void;
}

export const SORT_OPTIONS: SortOption[] = ['학년', '교과목 구분', '학점'];
const VIEW_OPTIONS: ViewOption[] = ['카드형', '목록형'];

function SortOptions({ selectedOption, changeOption }: SortOptionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {SORT_OPTIONS.map((option) => (
        <Tag
          key={option}
          label={option}
          variant={option === selectedOption ? 'solid' : 'outline'}
          onClick={
            option === selectedOption ? undefined : () => changeOption(option)
          }
        />
      ))}
    </div>
  );
}

const getViewOption = (view: unknown): ViewOption => {
  return VIEW_OPTIONS.includes(view as ViewOption)
    ? (view as ViewOption)
    : '목록형';
};

const getSortOption = (sort: unknown): SortOption => {
  return SORT_OPTIONS.includes(sort as SortOption)
    ? (sort as SortOption)
    : '학년';
};
