import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
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
      className="flex h-7.5 w-54 justify-center rounded-[.0625rem] bg-neutral-200 pr-1 outline-none"
      onSubmit={(e) => {
        e.preventDefault();
        submitSearch();
      }}
    >
      <input
        aria-label={t('통합검색')}
        type="text"
        id="search"
        className="autofill-bg-neutral-200 h-auto w-full border-0 bg-transparent px-2 text-xs shadow-none outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" variant="quiet" size="sm" ariaLabel={t('통합검색')}>
        <Search className="h-5 w-5" strokeWidth={1.5} />
      </Button>
    </form>
  );
}
