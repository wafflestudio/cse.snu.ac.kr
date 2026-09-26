import { useNavigate, useSearch } from '@tanstack/react-router';
import PillGroup from '@/components/ui/PillGroup';
import TextToggle from '@/components/ui/TextToggle';
import { useLanguage } from '@/hooks/useLanguage';
import type {
  SortOption,
  ViewOption,
} from '@/routes/$locale/academics/-constants';
import translations from './translations.json';

interface CourseToolbarProps {
  hideSortOption?: boolean;
}

export default function CourseToolbar({
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
    <div className="mb-6 flex items-center justify-between">
      <ViewOptions
        selectedOption={viewOption}
        changeOption={(option) => changeOption('view', option)}
      />
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

  // 카드형은 데스크톱 전용이라 토글도 데스크톱만 보인다.
  return (
    <div className="hidden sm:block">
      <TextToggle
        ariaLabel="보기 방식"
        options={(['목록형', '카드형'] as const).map((value) => ({
          value,
          label: t(value),
        }))}
        value={selectedOption}
        onChange={changeOption}
      />
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
    <PillGroup
      ariaLabel="정렬"
      options={SORT_OPTIONS.map((value) => ({ value, label: value }))}
      value={selectedOption}
      onChange={changeOption}
    />
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
