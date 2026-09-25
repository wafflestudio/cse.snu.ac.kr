import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import { useLanguage } from '@/hooks/useLanguage';

const translations = {
  통합검색: 'Search',
};

export default function HeaderSearchBar() {
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const location = useLocation();
  const { t } = useLanguage(translations);

  const keyword = search.keyword;
  const pathname = location.pathname;

  useEffect(() => {
    if (keyword && pathname.includes('/search')) {
      setText(keyword);
    }
  }, [keyword, pathname]);

  const submitSearch = () => {
    const query = text.trim();
    if (query !== '') {
      navigate({ to: `/search?keyword=${query}` });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitSearch();
      }}
    >
      <SearchInput
        tone="dark"
        ariaLabel={t('통합검색')}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </form>
  );
}
