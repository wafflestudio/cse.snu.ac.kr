import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

interface LinkRowProps {
  to: string;
  title: string;
  subtitle?: string;
}

export default function LinkRow({ to, title, subtitle }: LinkRowProps) {
  return (
    <Link
      to={to}
      className={clsx(
        'group flex items-center justify-between border-l-[5px] pl-7 duration-300',
        'h-10',
        'border-main-orange-muted',
      )}
    >
      <div
        className={clsx(
          'flex items-end gap-3',
          'text-white',
          'group-hover:text-main-orange',
        )}
      >
        <p className="text-base font-medium sm:text-lg">{title}</p>
        {subtitle && <p className="text-xs font-medium">{subtitle}</p>}
      </div>
      <ArrowRight
        className={clsx(
          'size-7.5 duration-300 group-hover:translate-x-[10px]',
          'text-white',
          'group-hover:text-main-orange',
        )}
      />
    </Link>
  );
}
