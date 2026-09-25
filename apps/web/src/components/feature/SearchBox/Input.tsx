import { Search } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface KeywordInputProps {
  defaultValue: string;
  disabled?: boolean;
}

export default function Input({
  defaultValue,
  disabled = false,
}: KeywordInputProps) {
  const { t } = useLanguage({ 검색: 'Search' });

  return (
    <div className="flex items-center">
      <label
        htmlFor="search"
        className="mr-8 whitespace-nowrap type-label tracking-wide"
      >
        {t('검색')}
      </label>
      <div className="relative flex h-7.5 w-54 items-center justify-between rounded-xs bg-white pr-3">
        <input
          type="text"
          id="search"
          name="keyword"
          className="autofill-bg-white w-full rounded-xs bg-transparent px-2 type-ui tracking-wide outline-none"
          defaultValue={defaultValue}
          disabled={disabled}
        />
        <button
          type="submit"
          // 아이콘은 20px 인데 터치 타깃 최소가 24px 다. 음수 마진으로 레이아웃은 그대로 두고 클릭 영역만 넓힌다.
          className="-m-0.5 p-0.5 text-neutral-950 hover:text-neutral-500"
          aria-label={t('검색')}
        >
          <Search className="size-5" />
        </button>
      </div>
    </div>
  );
}
