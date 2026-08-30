/**
 * `/img` 최적화 프록시의 **클라이언트 측 URL 빌더**. 처리자(리사이즈·AVIF·디스크 캐시)는
 * 서버 전용 `utils/imageOptimizer.tsx`에 있다 — 그쪽은 sharp·node:fs를 쓰므로 여기서
 * import하면 안 된다(클라 번들 오염). 이 파일은 문자열 조립만 한다.
 */

const DEFAULT_QUALITY = 50;

/** 프록시에 보낼 가치가 있는 URL인가. 안 보내도 되는 건 왕복 없이 원본을 그대로 쓴다. */
export function shouldOptimize(src: string | undefined): src is string {
  if (!src) return false;
  // 절대 URL만(프록시가 원본을 fetch해야 한다)
  if (!src.startsWith('http://') && !src.startsWith('https://')) return false;
  // 벡터·애니메이션은 래스터 변환이 손해
  if (src.endsWith('.svg') || src.endsWith('.gif')) return false;
  // 이미 프록시를 거친 URL
  if (src.includes('/img?')) return false;

  return true;
}

export function buildOptimizedUrl(
  src: string,
  quality = DEFAULT_QUALITY,
  width?: number,
): string {
  const params = new URLSearchParams({ url: src, q: quality.toString() });
  if (width) params.set('w', width.toString());
  return `/img?${params.toString()}`;
}

/**
 * width가 정해진 이미지의 `src`(1x)와 `srcSet`(1x·2x·3x).
 * 고밀도 디스플레이에서 브라우저가 알아서 고르게 한다.
 */
export function buildResponsiveSrc(
  src: string,
  width: number,
  quality?: number,
) {
  const densities = [1, 2, 3];
  const urls = densities.map((d) => buildOptimizedUrl(src, quality, width * d));

  return {
    src: urls[0],
    srcSet: urls.map((url, i) => `${url} ${width * densities[i]}w`).join(', '),
  };
}
