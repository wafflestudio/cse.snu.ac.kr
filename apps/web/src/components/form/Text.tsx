import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

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

  return (
    <input
      type="text"
      className={clsx(
        maxWidth,
        'autofill-bg-white h-8 rounded-xs border border-neutral-300',
        bgColor,
        'pl-2 text-sm outline-none placeholder:text-neutral-300 disabled:text-neutral-400',
        textCenter && 'pr-2 text-center',
        className,
      )}
      {...props}
      {...register(name, options)}
    />
  );
}
