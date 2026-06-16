import { useRouter } from '@tanstack/react-router';

// 클라에서 최초 문서의 nonce를 한 번 읽어 캐시한다. CSP 헤더는 최초 응답에 고정이라,
// SPA 네비게이션으로 새로 주입되는 <style>도 같은 nonce여야 통과한다(매 네비 새 nonce 금지).
let cachedNonce: string | undefined;

/**
 * 현재 요청의 CSP nonce를 반환한다(HTMLViewer의 <style nonce> 등에서 사용).
 * - 서버: router.options.ssr.nonce(요청별 생성값).
 * - 클라: SSR이 심어둔 <meta name="csp-nonce">를 읽어 캐시.
 */
export const useNonce = (): string | undefined => {
  const router = useRouter();

  if (typeof window === 'undefined') {
    return router.options.ssr?.nonce;
  }

  if (cachedNonce === undefined) {
    cachedNonce =
      document
        .querySelector('meta[name="csp-nonce"]')
        ?.getAttribute('content') ?? undefined;
  }
  return cachedNonce;
};
