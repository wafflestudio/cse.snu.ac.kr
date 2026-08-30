import { useSyncExternalStore } from 'react';

// Tailwind `sm`(min-width: 640px)의 여집합. 소수 뷰포트(브라우저 줌)까지 커버.
const MOBILE_QUERY = '(max-width: 639.98px)';

const subscribe = (onStoreChange: () => void) => {
  const mql = window.matchMedia(MOBILE_QUERY);
  // resize와 달리 브레이크포인트를 넘을 때만 발화한다.
  mql.addEventListener('change', onStoreChange);
  return () => mql.removeEventListener('change', onStoreChange);
};

/**
 * 모바일 뷰포트 여부(640px 미만).
 * 서버는 뷰포트를 알 수 없어 모바일로 가정한다 — 데스크톱은 하이드레이션 후 확정된다.
 * CSS(`hidden sm:*`)로 되는 분기는 CSS를 쓰고, 이 훅은 값 계산·컴포넌트 분기에만 쓴다.
 */
export default function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => true,
  );
}
