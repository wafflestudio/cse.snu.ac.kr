import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';

interface SetOptions {
  preventScrollReset?: boolean;
  replace?: boolean;
}
type SetSearchParamsArg =
  | URLSearchParams
  | Record<string, string>
  | ((prev: URLSearchParams) => URLSearchParams);

/**
 * 라우트 무관 범용 URL 검색 파라미터 훅(TanStack 기반).
 * - 읽기: 현재 location.searchStr를 URLSearchParams로(searchStr 변경 시에만 재생성).
 * - 쓰기: `navigate({ to: '.', search })`로 현재 라우트의 검색을 통째로 교체.
 *
 * TanStack의 타입드 `useSearch`/`validateSearch`는 라우트별 스키마를 전제하지만, 여기
 * (Pagination·SearchBox·정렬 토글 등)는 라우트 횡단 범용 검색 조작이라 이 훅이 적합하다.
 * (RR 호환 셰임 `~/lib/router`를 대체한 마지막 조각.)
 */
export function useSearchParams(): [
  URLSearchParams,
  (next: SetSearchParamsArg, options?: SetOptions) => void,
] {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const navigate = useNavigate();

  const searchParams = useMemo(
    () => new URLSearchParams(searchStr ?? ''),
    [searchStr],
  );

  const setSearchParams = useCallback(
    (next: SetSearchParamsArg, options?: SetOptions) => {
      let resolved: URLSearchParams;
      if (typeof next === 'function') {
        resolved = next(new URLSearchParams(searchStr ?? ''));
      } else if (next instanceof URLSearchParams) {
        resolved = next;
      } else {
        resolved = new URLSearchParams(next);
      }
      navigate({
        to: '.',
        search: () => Object.fromEntries(resolved),
        resetScroll: options?.preventScrollReset ? false : undefined,
        replace: options?.replace,
      });
    },
    [navigate, searchStr],
  );

  return [searchParams, setSearchParams];
}
