import TextToggle from '@/components/ui/TextToggle';

export type Language = 'ko' | 'en';

const OPTIONS = [
  { value: 'ko', label: '한글' },
  { value: 'en', label: 'English' },
] as const satisfies readonly { value: Language; label: string }[];

export default function LanguagePicker({
  selected,
  onChange,
}: {
  selected: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <div className="mb-8">
      <TextToggle
        options={OPTIONS}
        value={selected}
        onChange={onChange}
        ariaLabel="편집 언어"
      />
    </div>
  );
}
