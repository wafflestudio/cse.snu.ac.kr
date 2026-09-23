import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { useFieldErrorAttributes } from './FieldError';

interface BasicTextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  options?: RegisterOptions;
  maxWidth?: string;
  bgColor?: string;
  textCenter?: boolean;
}

export default function Text({
  maxWidth,
  bgColor = 'bg-white',
  textCenter,
  name,
  options,
  className,
  ...props
}: BasicTextInputProps) {
  const { register } = useFormContext();
  const errorAttributes = useFieldErrorAttributes(name);

  return (
    <input
      type="text"
      className={clsx(
        maxWidth,
        'autofill-bg-white h-8 rounded-xs border border-neutral-300',
        bgColor,
        'pl-2 text-sm outline-none placeholder:text-neutral-500 disabled:text-neutral-400',
        textCenter && 'pr-2 text-center',
        className,
      )}
      {...props}
      {...register(name, options)}
      aria-invalid={errorAttributes['aria-invalid'] ?? props['aria-invalid']}
      aria-describedby={
        clsx(props['aria-describedby'], errorAttributes['aria-describedby']) ||
        undefined
      }
    />
  );
}
