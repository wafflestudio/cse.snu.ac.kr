import { useNavigate, useSearch } from '@tanstack/react-router';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import { useLanguage } from '@/hooks/useLanguage';

export default function SeminarSearchBar() {
  const { t } = useLanguage({ 검색: 'Search', 검색어: 'Keyword' });
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const keyword = search.keyword ?? '';
  const [text, setText] = useState(keyword);

  useEffect(() => {
    setText(keyword);
  }, [keyword]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedText = text.trim();
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        keyword: trimmedText || undefined,
        pageNum: undefined, // 검색하면 1페이지로
      }),
    });
  };

  // 태그 없는 검색이라 이름 없이 칸만 두고 자리표시로 알린다.
  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <SearchInput
        ariaLabel={t('검색')}
        placeholder={t('검색어')}
        value={text}
        onChange={handleChange}
      />
    </form>
  );
}
