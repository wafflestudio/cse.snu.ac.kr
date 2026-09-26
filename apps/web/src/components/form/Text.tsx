import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import {
  FIELD_CLASS,
  FIELD_WIDTH,
  type FieldWidth,
  fieldBorder,
} from '@/components/ui/field';
import FieldError, { useFieldError } from './FieldError';

interface TextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  name: string;
  options?: RegisterOptions;
  // 폭 네 단계(/design-system/form). 기본은 영역 전체.
  size?: FieldWidth;
}

export default function Text({
  name,
  options,
  size = 'full',
  hidden,
  ...props
}: TextProps) {
  const { register } = useFormContext();
  const error = useFieldError(name);

  return (
    <div className={clsx(FIELD_WIDTH[size], hidden && 'hidden')}>
      <input
        type="text"
        className={clsx(
          'w-full',
          FIELD_CLASS,
          fieldBorder(error !== undefined),
        )}
        aria-invalid={error !== undefined || undefined}
        {...props}
        {...register(name, options)}
      />
      <FieldError message={error} />
    </div>
  );
}
