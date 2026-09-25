import { Search } from 'lucide-react';
import Button from '@/components/ui/Button';
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
      <div className="relative flex h-7.5 w-54 items-center justify-between rounded-xs bg-white pr-2.5">
        <input
          type="text"
          id="search"
          name="keyword"
          className="autofill-bg-white w-full rounded-xs bg-transparent px-2 type-ui tracking-wide outline-none"
          defaultValue={defaultValue}
          disabled={disabled}
        />
        {/* 아이콘 20px + 둘레 2px 로 클릭 영역 24px. */}
        <Button type="submit" variant="text" ariaLabel={t('검색')}>
          <Search className="box-content size-5 p-0.5" />
        </Button>
      </div>
    </div>
  );
}
