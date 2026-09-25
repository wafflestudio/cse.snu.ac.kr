import { useFormContext, useWatch } from 'react-hook-form';

import Button from '@/components/ui/Button';

import Text from './Text';

interface Props {
  name: string;
  placeholder?: string;
}

export default function TextList({ name, placeholder }: Props) {
  const { getValues, setValue } = useFormContext();

  const list = useWatch({ name }) as string[] | undefined;
  const newValueName = `${name}_new`;

  const handleAdd = () => {
    const newValue = getValues(newValueName);
    const newList = [newValue, ...(list ?? [])];
    setValue(name, newList);
    setValue(newValueName, '');
  };

  const handleDelete = (index: number) => {
    const newList = list?.filter((_, i) => i !== index);
    setValue(name, newList);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Text
          key={name}
          size="lg"
          name={newValueName}
          placeholder={placeholder}
        />
        <Button variant="secondary" onClick={handleAdd}>
          추가
        </Button>
      </div>
      {list?.map((_, idx) => (
        <div className="flex items-center gap-3" key={idx}>
          <Text size="lg" name={`${name}.${idx}`} placeholder={placeholder} />
          <Button variant="secondary" onClick={() => handleDelete(idx)}>
            삭제
          </Button>
        </div>
      ))}
    </div>
  );
}
