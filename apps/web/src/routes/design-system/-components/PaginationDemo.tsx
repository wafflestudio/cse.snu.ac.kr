import { useSearch } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import Pagination from '@/components/ui/Pagination';

export function PaginationDemo() {
  const { search, remember } = useSpecimenScroll();
  const rawPage = Number(search.pageNum);
  const page = Number.isInteger(rawPage)
    ? Math.max(1, Math.min(12, rawPage))
    : 1;
  return (
    <div
      className="leading-[1.2] max-w-[560px] overflow-x-auto [&_output]:mt-0 [&_output]:mb-5 [&_output]:text-center max-sm:[&>div>ul]:gap-0.5 max-sm:[&>div>ul>div]:gap-0.5 max-sm:[&>div>ul>div]:px-0.5"
      onClickCapture={remember}
    >
      <output className="mt-3 block text-xs/[1.7] text-neutral-500">
        현재 페이지 {page} / 12
      </output>
      <Pagination page={page} totalPages={12} />
    </div>
  );
}

function useSpecimenScroll() {
  const search = useSearch({ strict: false });
  const previousSearch = useRef(search);
  const position = useRef<number | null>(null);
  useEffect(() => {
    if (previousSearch.current === search) return;
    previousSearch.current = search;
    if (position.current === null) return;
    const y = position.current;
    position.current = null;
    const frame = requestAnimationFrame(() => window.scrollTo({ top: y }));
    return () => cancelAnimationFrame(frame);
  }, [search]);
  return {
    search,
    remember: () => {
      position.current = window.scrollY;
    },
  };
}
