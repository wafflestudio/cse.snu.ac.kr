import { useCallback, useSyncExternalStore } from 'react';

// DS-023: app.css shell=75rem; Tailwind lg=64rem. Keep display and event logic aligned.
const MOBILE_QUERY = '(max-width: 639.98px)';
const COMPACT_NAVIGATION_QUERY = '(width < 75rem)';
const COMPACT_CONTENT_QUERY = '(width < 64rem)';

function useViewportQuery(query: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onStoreChange);
      return () => mql.removeEventListener('change', onStoreChange);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );
  // SSR cannot know the viewport. CSS handles purely visual branches.
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}

/** Existing small-screen page count; independent of the navigation frame. */
export default function useIsMobile() {
  return useViewportQuery(MOBILE_QUERY);
}

export function useCompactNavigation() {
  return useViewportQuery(COMPACT_NAVIGATION_QUERY);
}

export function useCompactContent() {
  return useViewportQuery(COMPACT_CONTENT_QUERY);
}

/** For event handlers, paired with the lg calendar columns. */
export function isCompactContentViewport() {
  return window.matchMedia(COMPACT_CONTENT_QUERY).matches;
}
