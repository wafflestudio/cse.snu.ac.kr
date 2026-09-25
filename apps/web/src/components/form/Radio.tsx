import type { RegisterOptions } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';
import UiRadio from '@/components/ui/Radio';

interface Props {
  value: string;
  name: string;
  label?: string;
  options?: RegisterOptions;
}

export default function Radio({ name, value, label = name, options }: Props) {
  const { register } = useFormContext();
  const selected = useWatch({ name });

  return (
    <UiRadio
      label={label}
      value={value}
      checked={selected === value}
      {...register(name, options)}
    />
  );
}
