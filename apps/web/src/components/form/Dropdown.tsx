import { useController } from 'react-hook-form';
import UiDropdown from '@/components/ui/Dropdown';
import type { Rules } from '@/types/form';
import FieldError, { useFieldError } from './FieldError';

// 모양·키보드는 ui/Dropdown 한 벌. 여기서는 값 ↔ 항목 번호를 폼 값에 잇기만 한다.
interface DropdownProps {
  contents: { label: string; value: unknown }[];
  name: string;
  isDisabled?: boolean;
  rules?: Rules;
  onChange?: (value: unknown) => void;
}

export default function Dropdown({
  contents,
  name,
  isDisabled,
  rules,
  onChange,
}: DropdownProps) {
  const {
    field: { value, onChange: onChangeFromController },
  } = useController({ name, rules });
  const error = useFieldError(name);

  return (
    <div className="w-fit">
      <UiDropdown
        contents={contents.map((x) => x.label)}
        selectedIndex={contents.findIndex((x) => x.value === value)}
        onClick={(index) => {
          onChangeFromController(contents[index].value);
          onChange?.(contents[index].value);
        }}
        disabled={isDisabled}
        invalid={error !== undefined}
      />
      <FieldError message={error} />
    </div>
  );
}
