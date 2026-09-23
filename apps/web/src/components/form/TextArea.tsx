import clsx from 'clsx';
import type { TextareaHTMLAttributes } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { useFieldErrorAttributes } from './FieldError';

export default function TextArea({
  name,
  options,
  className,
  ...props
}: {
  name: string;
  options?: RegisterOptions;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { register } = useFormContext();
  const errorAttributes = useFieldErrorAttributes(name);
  return (
    <textarea
      {...register(name, options)}
      {...props}
      aria-invalid={errorAttributes['aria-invalid'] ?? props['aria-invalid']}
      aria-describedby={
        clsx(props['aria-describedby'], errorAttributes['aria-describedby']) ||
        undefined
      }
      className={clsx(
        'autofill-bg-white h-20 w-full resize-none rounded-xs border border-neutral-300 p-2 text-sm outline-none placeholder:text-neutral-500',
        className,
      )}
    />
  );
}
