import { Search } from 'lucide-react';
import { useId } from 'react';
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
  const inputId = useId();

  return (
    <div className="flex items-center">
      <label
        htmlFor={inputId}
        className="mr-7 whitespace-nowrap text-md font-bold"
      >
        {t('검색')}
      </label>
      <div className="relative flex min-h-8 w-54 items-center justify-between rounded-sm bg-white pr-3">
        <input
          type="text"
          id={inputId}
          name="keyword"
          className="autofill-bg-white w-full rounded-sm bg-transparent px-2 text-sm outline-none"
          defaultValue={defaultValue}
          disabled={disabled}
        />
        <button
          type="submit"
          // 아이콘은 20px 인데 터치 타깃 최소가 24px 다. 음수 마진으로 레이아웃은 그대로 두고 클릭 영역만 넓힌다.
          className="-m-0.5 p-0.5 text-neutral-800 hover:text-neutral-500"
          aria-label={t('검색')}
        >
          <Search className="size-4" />
        </button>
      </div>
    </div>
  );
}
