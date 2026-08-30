import { useNavigate, useSearch } from '@tanstack/react-router';
import clsx from 'clsx';
import Node from '@/components/ui/Nodes';
import Input from './Input';
import SelectedTags from './SelectedTags';
import TagCheckBoxes from './TagCheckboxes';

interface SearchBoxProps {
  tags: string[];
  disabled?: boolean;
  formOnly?: boolean;
}

export default function SearchBox({
  tags,
  disabled = false,
  formOnly = false,
}: SearchBoxProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const selectedTags = search.tag ?? [];
  const initialKeyword = search.keyword ?? '';

  const handleSearch = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const keyword = String(formData.get('keyword') ?? '').trim();

    // 검색 실행 시 페이지는 1로(=생략). 태그는 유지.
    navigate({
      to: '.',
      search: {
        keyword: keyword || undefined,
        tag: selectedTags.length > 0 ? selectedTags : undefined,
      },
    });
  };

  return (
    <div className={clsx('mb-9 w-full', disabled && 'opacity-30')}>
      <form
        className={clsx(
          'flex flex-col gap-5 rounded-sm bg-neutral-50 p-6',
          !formOnly && 'mb-9',
        )}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(e.currentTarget);
        }}
      >
        <TagCheckBoxes
          tags={tags}
          selectedTags={selectedTags}
          disabled={disabled}
        />
        <Input
          key={initialKeyword}
          defaultValue={initialKeyword}
          disabled={disabled}
        />
      </form>

      {!formOnly && (
        <>
          <div className="mb-3 mt-9">
            <Node variant="straightDouble" direction="row" />
          </div>
          <SelectedTags tags={selectedTags} disabled={disabled} />
        </>
      )}
    </div>
  );
}
