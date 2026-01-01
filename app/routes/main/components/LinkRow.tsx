import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

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
        'border-[#E65817]',
      )}
    >
      <div
        className={clsx(
          'flex items-end gap-3',
          'text-white',
          'group-hover:text-main-orange',
        )}
      >
        <p className="text-base font-medium sm:text-lg sm:font-semibold">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs font-medium sm:font-semibold">{subtitle}</p>
        )}
      </div>
      <ArrowRight
        className={clsx(
          'pt-0.5 h-[30px] w-[30px] duration-300 group-hover:translate-x-[10px]',
          'text-white',
          'group-hover:text-main-orange',
        )}
        strokeWidth={1.5}
      />
    </Link>
  );
}
