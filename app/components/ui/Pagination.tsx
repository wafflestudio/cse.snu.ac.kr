import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import useIsMobile from '~/hooks/useResponsive';

interface PaginationProps {
  page: number;
  totalPages: number;
  disabled?: boolean;
}

const DESKTOP_PAGE_COUNT = 10;
const MOBILE_PAGE_COUNT = 5;

export default function Pagination({
  page,
  totalPages,
  disabled = false,
}: PaginationProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const pageLimit = isMobile ? MOBILE_PAGE_COUNT : DESKTOP_PAGE_COUNT;
  const safeTotalPages = Math.max(1, totalPages);
  const firstNum = page - ((page - 1) % pageLimit);
  const count = Math.max(1, Math.min(pageLimit, safeTotalPages - firstNum + 1));

  const handleChange = (nextPage: number) => {
    if (disabled || nextPage === page) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('pageNum', nextPage.toString());
    navigate({ search: newParams.toString() });
  };

  return (
    <div className={clsx('flex justify-center', disabled && 'opacity-30')}>
      <ul className="mx-auto flex h-6 gap-x-2 tracking-wide text-neutral-800">
        <PaginationArrow
          icon={ChevronsLeft}
          disabled={page === 1 || disabled}
          onClick={() => handleChange(1)}
          ariaLabel="첫 페이지"
        />
        <PaginationArrow
          icon={ChevronLeft}
          disabled={firstNum === 1 || disabled}
          onClick={() => handleChange(Math.max(1, firstNum - 1))}
          ariaLabel="이전 페이지"
        />
        <div className="flex gap-x-2 px-2">
          {Array(count)
            .fill(firstNum)
            .map((num, i) => (
              <PaginationNumber
                key={num + i}
                num={num + i}
                isSelected={page === num + i}
                disabled={disabled}
                onClick={() => handleChange(num + i)}
              />
            ))}
        </div>
        <PaginationArrow
          icon={ChevronRight}
          disabled={firstNum + pageLimit > safeTotalPages || disabled}
          onClick={() =>
            handleChange(Math.min(safeTotalPages, firstNum + pageLimit))
          }
          ariaLabel="다음 페이지"
        />
        <PaginationArrow
          icon={ChevronsRight}
          disabled={page === safeTotalPages || disabled}
          onClick={() => handleChange(safeTotalPages)}
          ariaLabel="마지막 페이지"
        />
      </ul>
    </div>
  );
}

interface PaginationArrowProps {
  icon: LucideIcon;
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
}

function PaginationArrow({
  icon: Icon,
  disabled,
  onClick,
  ariaLabel,
}: PaginationArrowProps) {
  return disabled ? (
    <Icon className="pointer-events-none h-6 w-6 cursor-default text-neutral-400" />
  ) : (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer hover:text-main-orange"
      aria-label={ariaLabel}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}

interface PaginationNumberProps {
  num: number;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
}

function PaginationNumber({
  num,
  isSelected,
  disabled,
  onClick,
}: PaginationNumberProps) {
  const cursorStyle =
    isSelected || disabled
      ? 'cursor-default pointer-events-none'
      : 'cursor-pointer';
  const textStyle = isSelected
    ? 'text-main-orange'
    : disabled
      ? ''
      : 'hover:text-main-orange';

  return (
    <button
      type="button"
      className={clsx(
        'flex items-center justify-center px-2',
        cursorStyle,
        textStyle,
      )}
      onClick={onClick}
      aria-current={isSelected ? 'page' : undefined}
    >
      <span className={clsx('text-md', isSelected && 'font-bold underline')}>
        {num}
      </span>
    </button>
  );
}
