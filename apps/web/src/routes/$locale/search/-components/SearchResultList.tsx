import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { SearchResult, SearchResultItem } from '@/types/api';
import { fetchSearchPage } from '../-api';
import SearchResultRow from './ui/SearchResultRow';

interface SearchResultListProps {
  keyword: string;
  tags: string[];
  /** loader가 SSR로 받아온 첫 장. 뒤 장은 이 컴포넌트가 이어 붙인다. */
  firstPage: SearchResult;
}

type Status = 'idle' | 'loading' | 'error';

/**
 * 검색 결과 무한 스크롤.
 *
 * 첫 장은 loader가 서버에서 받아오고(검색 결과가 SSR로 나가야 한다), 목록 끝의
 * 센티넬이 보이면 다음 장을 이어 붙인다.
 *
 * 끝은 빈 응답으로만 판정한다. ⚠️ "받은 게 한 장보다 적으면 마지막 장"으로 보면 안 된다 —
 * 백엔드가 창(from/size)에 걸린 문서 중 제목 없는 것을 버리고(`mapNotNull`) 주기 때문에
 * 중간 장도 20건이 안 될 수 있다(prod '삼성': total 879인데 1장이 19건 → 첫 장에서 끝으로
 * 보고 스크롤이 멎었다). 대신 마지막 장 뒤에 빈 요청이 한 번 나간다 — 그 값은 치른다.
 *
 * ⚠️ 새 검색어로 바뀌어도 이 컴포넌트는 재마운트되지 않을 수 있다(TanStack 라우터).
 * 부모가 검색 조건을 `key`로 넘겨 상태를 초기화한다.
 */
export default function SearchResultList({
  keyword,
  tags,
  firstPage,
}: SearchResultListProps) {
  const { locale, t } = useLanguage({
    '검색 결과를 불러오는 중': 'Loading more results',
    '검색 결과를 더 불러오지 못했습니다.': 'Failed to load more results.',
  });

  const [items, setItems] = useState(firstPage.results);
  const [status, setStatus] = useState<Status>('idle');
  const [exhausted, setExhausted] = useState(firstPage.results.length === 0);
  const pageRef = useRef(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    setStatus('loading');
    try {
      const next = await fetchSearchPage({
        keyword,
        locale,
        tags,
        pageNum: pageRef.current + 1,
      });
      pageRef.current += 1;
      const merged = appendNew(items, next.results);
      setItems(merged);
      setExhausted(next.results.length === 0);
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }, [items, keyword, locale, tags]);

  // 한 장을 받을 때마다(status: loading→idle) 관찰을 다시 건다. IntersectionObserver는
  // observe 직후 현재 교차 상태를 한 번 알려주므로, 받은 장이 화면을 못 채우면
  // 채울 때까지 이어진다.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || exhausted || status !== 'idle') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: '400px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [exhausted, status, loadMore]);

  // 실패 후엔 관찰을 다시 걸지 않는다 — 센티넬이 계속 보이는 상태라 즉시 재요청이
  // 반복된다. 사용자가 스크롤하면 그때 한 번 더 시도한다.
  useEffect(() => {
    if (status !== 'error') return;
    const retry = () => setStatus('idle');
    window.addEventListener('scroll', retry, { once: true, passive: true });
    return () => window.removeEventListener('scroll', retry);
  }, [status]);

  return (
    <div className="flex max-w-[768px] grow flex-col">
      {/* 행 사이 간격은 안쪽에서만 준다 — 센티넬이 바깥 flex 자식이면 결과가 짧을 때
          빈 div 하나가 목록 아래에 gap을 만든다. */}
      <div className="flex flex-col gap-7">
        {items.map((item) => (
          <SearchResultRow key={itemKey(item)} item={item} />
        ))}
      </div>

      {!exhausted && <div ref={sentinelRef} aria-hidden />}

      {status === 'loading' && (
        <output
          className="flex justify-center py-2 text-neutral-400"
          aria-label={t('검색 결과를 불러오는 중')}
        >
          <LoaderCircle size={20} className="animate-spin" />
        </output>
      )}

      {status === 'error' && (
        <p className="py-2 text-center text-md text-neutral-500">
          {t('검색 결과를 더 불러오지 못했습니다.')}
        </p>
      )}
    </div>
  );
}

const itemKey = (item: SearchResultItem) => `${item.type}:${item.id}`;

/**
 * 장 사이에 같은 항목이 올 수 있다 — 백엔드가 커서 없이 from/size 로 자르기 때문이다.
 * 점수에 시간 감쇠(origin=now)가 곱해져 요청 시각이 다르면 동점 부근 순서가 뒤집힐 수
 * 있고, 스크롤 도중 글이 하나 색인되면 뒤 장이 통째로 한 칸 밀린다.
 * 겹치는 건 버리고 이어 붙인다(같은 key 를 두 번 렌더하지 않도록).
 */
function appendNew(prev: SearchResultItem[], next: SearchResultItem[]) {
  const seen = new Set(prev.map(itemKey));
  return [...prev, ...next.filter((item) => !seen.has(itemKey(item)))];
}
