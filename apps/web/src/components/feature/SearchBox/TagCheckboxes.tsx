import { useNavigate } from '@tanstack/react-router';
import Checkbox from '@/components/ui/Checkbox';
import { useLanguage } from '@/hooks/useLanguage';

const TAG_COLUMNS = {
  80: 'grid-cols-[repeat(auto-fit,minmax(80px,1fr))]',
  160: 'grid-cols-[repeat(auto-fit,minmax(160px,1fr))]',
  240: 'grid-cols-[repeat(auto-fit,minmax(240px,1fr))]',
} as const;

export type TagColumnWidth = keyof typeof TAG_COLUMNS;

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  disabled: boolean;
  minColumnWidth?: TagColumnWidth;
}

export default function TagCheckBoxes({
  tags,
  selectedTags,
  disabled,
  minColumnWidth,
}: TagFilterProps) {
  const { t, tUnsafe, isEnglish } = useLanguage({ 태그: 'Tags' });
  const navigate = useNavigate();

  const toggleCheck = (tag: string, isChecked: boolean) => {
    const newTags = isChecked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);

    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        tag: newTags.length > 0 ? newTags : undefined,
        pageNum: undefined, // 필터가 바뀌면 1페이지로
      }),
      resetScroll: false,
    });
  };

  const longestTag = Math.max(...tags.map((tag) => tag.length));
  // DS-024 keeps the existing groups; DS-025 search supplies its English width.
  const defaultWidth = longestTag > 10 ? (isEnglish ? 240 : 160) : 80;
  const gridColsTailwind = TAG_COLUMNS[minColumnWidth ?? defaultWidth];

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-3 mr-6 whitespace-nowrap p-0 text-md font-bold tracking-wide">
        {t('태그')}
      </legend>
      <div className={`grid ${gridColsTailwind} gap-x-7 gap-y-2.5 pl-2.5`}>
        {tags.map((tag) => (
          <Checkbox
            key={tag}
            label={tUnsafe(tag)}
            checked={selectedTags.includes(tag)}
            name="tag"
            value={tag}
            onChange={(checked) => toggleCheck(tag, checked)}
            disabled={disabled}
          />
        ))}
      </div>
    </fieldset>
  );
}
