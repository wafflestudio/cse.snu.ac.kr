import { Search } from 'lucide-react';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';

export default function SeminarSearchBar() {
  const { t } = useLanguage({ 검색: 'Search' });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get('keyword') ?? '';
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
    const params = new URLSearchParams(searchParams);

    if (trimmedText) {
      params.set('keyword', trimmedText);
    } else {
      params.delete('keyword');
    }

    params.set('pageNum', '1');
    navigate({ search: params.toString() });
  };

  return (
    <form className="flex w-fit items-center gap-5" onSubmit={handleSubmit}>
      <label htmlFor="seminar-search" className="font-bold">
        {t('검색')}
      </label>
      <div className="flex h-7.5 w-60 items-center rounded-sm bg-neutral-100 pr-3">
        <input
          type="text"
          id="seminar-search"
          className="autofill-bg-neutral-100 w-full rounded-sm bg-transparent px-2 text-sm tracking-wide outline-none"
          value={text}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="text-neutral-800 hover:text-neutral-500"
          aria-label={t('검색')}
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>
    </form>
  );
}
