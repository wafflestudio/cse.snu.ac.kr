import { useNavigate } from '@tanstack/react-router';
import Checkbox from '@/components/ui/Checkbox';
import { useLanguage } from '@/hooks/useLanguage';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  disabled: boolean;
}

export default function TagCheckBoxes({
  tags,
  selectedTags,
  disabled,
}: TagFilterProps) {
  const { t, tUnsafe } = useLanguage({ 태그: 'Tags' });
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
  const gridColsTailwind =
    longestTag > 10
      ? 'grid-cols-[repeat(auto-fit,minmax(160px,1fr))]'
      : 'grid-cols-[repeat(auto-fit,minmax(80px,1fr))]';

  return (
    <div>
      <h5 className="mb-3 mr-6 whitespace-nowrap text-md font-bold tracking-wide">
        {t('태그')}
      </h5>
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
    </div>
  );
}
