import { useNavigate, useSearch } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';

export default function SeminarSearchBar() {
  const { t } = useLanguage({ 검색: 'Search' });
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

  return (
    <form className="flex w-fit items-center gap-4" onSubmit={handleSubmit}>
      <label htmlFor="seminar-search" className="type-label">
        {t('검색')}
      </label>
      <div className="flex h-7.5 w-60 items-center rounded-xs bg-neutral-100 pr-2.5">
        <input
          type="text"
          id="seminar-search"
          className="autofill-bg-neutral-100 w-full rounded-xs bg-transparent px-2 type-ui tracking-wide outline-none"
          value={text}
          onChange={handleChange}
        />
        {/* 아이콘 20px + 둘레 2px 로 클릭 영역 24px. */}
        <Button type="submit" variant="text" ariaLabel={t('검색')}>
          <Search className="box-content size-5 p-0.5" />
        </Button>
      </div>
    </form>
  );
}
