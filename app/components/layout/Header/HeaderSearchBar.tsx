import { useLocation, useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '~/components/ui/Button';
import { useLanguage } from '~/hooks/useLanguage';
import { useSearchParams } from '~/hooks/useSearchParams';

const translations = {
  통합검색: 'Search',
};

export default function HeaderSearchBar() {
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { t } = useLanguage(translations);

  const keyword = searchParams.get('keyword');
  const pathname = location.pathname;

  useEffect(() => {
    if (keyword && pathname.includes('/search')) {
      setText(keyword);
    }
  }, [keyword, pathname]);

  const search = () => {
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
        search();
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
      <Button
        type="submit"
        kind="quiet"
        size="sm"
        ariaLabel={t('통합검색')}
        iconLeft={<Search className="h-5 w-5" strokeWidth={1.5} />}
      />
    </form>
  );
}
