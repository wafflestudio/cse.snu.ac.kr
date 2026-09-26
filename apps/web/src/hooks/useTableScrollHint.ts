import { type RefObject, useEffect } from 'react';

/**
 * 본문 표가 옆으로 더 있으면 `data-more-right` 를 붙인다 — CSS 가 오른쪽 끝을 흐리게 한다.
 * iPhone Safari 는 스크롤 막대를 늘 숨겨서, 표가 옆으로 이어진다는 걸 이 표시로 알린다(/design-system#reading).
 */
export function useTableScrollHint(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const tables = [...root.querySelectorAll('table')];
    if (tables.length === 0) return;

    const update = (table: HTMLTableElement) => {
      const more = table.scrollLeft + table.clientWidth < table.scrollWidth - 1;
      table.toggleAttribute('data-more-right', more);
    };
    const onScroll = (e: Event) => update(e.currentTarget as HTMLTableElement);
    const onResize = () => {
      for (const table of tables) update(table);
    };

    for (const table of tables) {
      update(table);
      table.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('resize', onResize);
    return () => {
      for (const table of tables) table.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  });
}
