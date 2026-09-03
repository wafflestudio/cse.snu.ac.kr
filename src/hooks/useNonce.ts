import { useRouter } from '@tanstack/react-router';

// 클라에서 최초 문서의 nonce를 한 번 읽어 캐시한다. CSP 헤더는 최초 응답에 고정이라,
// SPA 네비게이션으로 새로 주입되는 <style>도 같은 nonce여야 통과한다(매 네비 새 nonce 금지).
let cachedNonce: string | undefined;

/**
 * 현재 요청의 CSP nonce를 반환한다(HTMLViewer의 <style nonce> 등에서 사용).
 * - 서버: router.options.ssr.nonce(요청별 생성값).
 * - 클라: SSR 스크립트의 nonce를 IDL로 읽어 캐시.
 */
export const useNonce = (): string | undefined => {
  const router = useRouter();

  if (typeof window === 'undefined') {
    return router.options.ssr?.nonce;
  }

  if (cachedNonce === undefined) {
    // TanStack이 SSR 스크립트에 스탬프한 nonce를 IDL 프로퍼티로 읽는다.
    // 브라우저는 nonce '속성'을 파싱 직후 비우고 IDL로만 노출한다(nonce hiding) —
    // 별도 <meta>로 복사하면 CSS 속성 선택자로 훔칠 수 있는 채널이 생기므로 쓰지 않는다.
    cachedNonce =
      document.querySelector<HTMLScriptElement>('script[nonce]')?.nonce ||
      undefined;
  }
  return cachedNonce;
};
