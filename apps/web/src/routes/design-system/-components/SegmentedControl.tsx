export function SegmentedControl<T extends string | boolean>({
  name,
  label,
  value,
  options,
  onChange,
}: {
  name: string;
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="flex min-w-0 flex-wrap items-center">
      <legend className="mb-2 text-xs/[inherit] font-medium text-neutral-600">
        {label}
      </legend>
      {options.map((option, index) => (
        <label key={String(option.value)} className="relative cursor-pointer">
          <input
            className="peer absolute size-px opacity-0"
            type="radio"
            name={name}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span
            className={`grid min-h-10 min-w-17.5 place-items-center border border-neutral-300 bg-white px-3 py-2 text-xs/[inherit] peer-checked:border-neutral-800 peer-checked:bg-neutral-800 peer-checked:text-white peer-focus-visible:relative peer-focus-visible:z-1 peer-focus-visible:outline-2 peer-focus-visible:outline-link peer-focus-visible:outline-offset-3 max-sm:min-w-17 max-sm:px-2.5 ${index > 0 ? 'border-l-0' : ''}`}
          >
            {option.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
