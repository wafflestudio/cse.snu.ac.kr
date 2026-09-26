import clsx from 'clsx';
import type { TextareaHTMLAttributes } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { fieldBorder } from '@/components/ui/field';
import FieldError, { useFieldError } from './FieldError';

export default function TextArea({
  name,
  options,
  ...props
}: {
  name: string;
  options?: RegisterOptions;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  return (
    <div className="w-full">
      <textarea
        {...register(name, options)}
        {...props}
        aria-invalid={error !== undefined || undefined}
        className={clsx(
          'block h-20 w-full resize-none rounded-xs border bg-white px-3 py-2 type-ui outline-none field-focus placeholder:text-neutral-300',
          fieldBorder(error !== undefined),
        )}
      />
      <FieldError message={error} />
    </div>
  );
}
