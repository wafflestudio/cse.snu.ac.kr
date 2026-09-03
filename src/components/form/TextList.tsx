import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

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
    <div>
      <div className="mb-2.5 flex gap-3">
        <Text
          key={name}
          maxWidth="w-[25rem]"
          name={newValueName}
          bgColor="bg-neutral-50"
          placeholder={placeholder}
        />
        <Button onClick={handleAdd} bgColor="bg-neutral-50">
          추가
        </Button>
      </div>
      {list?.map((_, idx) => (
        <div className="mb-2.5 flex gap-3" key={idx}>
          <Text
            maxWidth="w-[25rem]"
            name={`${name}.${idx}`}
            placeholder={placeholder}
          />
          <Button onClick={() => handleDelete(idx)}>삭제</Button>
        </div>
      ))}
    </div>
  );
}

function Button({
  bgColor,
  onClick,
  children,
}: {
  bgColor?: string;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      className={clsx(
        'h-8 rounded-sm border border-neutral-300 px-2.5 text-sm text-neutral-700 hover:bg-neutral-300',
        bgColor,
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
