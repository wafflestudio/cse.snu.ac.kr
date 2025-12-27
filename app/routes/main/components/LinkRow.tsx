import clsx from 'clsx';
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
      <span
        className={clsx(
          'material-symbols-outlined pt-0.5 text-[30px] font-extralight duration-300 group-hover:translate-x-[10px] group-hover:font-light',
          'text-white',
          'group-hover:text-main-orange',
        )}
      >
        arrow_forward
      </span>
    </Link>
  );
}
