import SearchInput from '@/components/ui/SearchInput';
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

  // 이름은 칸 위 — 같은 상자의 "태그" 이름과 같은 자리.
  return (
    <SearchInput
      label={t('검색')}
      ariaLabel={t('검색')}
      name="keyword"
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
}
