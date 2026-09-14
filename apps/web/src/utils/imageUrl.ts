/**
 * `/img` 최적화 프록시의 **클라이언트 측 URL 빌더**. 처리자(리사이즈·AVIF·디스크 캐시)는
 * 서버 전용 `utils/imageOptimizer.tsx`에 있다 — 그쪽은 sharp·node:fs를 쓰므로 여기서
 * import하면 안 된다(클라 번들 오염). 이 파일은 문자열 조립만 한다.
 */

/**
 * AVIF 품질. 전 호출부가 이 값 하나를 쓴다 — 사진마다 다르게 줄 근거가 없었다.
 * 50 은 얼굴에서 눈에 띄게 뭉개지고, 100 은 75 대비 4.5배인데 차이가 안 보인다.
 */
const QUALITY = 75;

/**
 * `/img` 가 원본을 가져올 수 있는 호스트(SSRF 방지). 핸들러의 검사와 본문 이미지 URL 재작성이
 * 같은 목록을 본다 — 여기 없는 호스트를 `/img` 로 보내면 403 깨진 이미지가 된다.
 */
const imageProxyHosts = (dev: boolean) => [
  'cse.snu.ac.kr',
  '168.107.16.249.nip.io',
  ...(dev ? ['localhost'] : []),
];

export function isImageProxyHost(hostname: string, dev: boolean): boolean {
  return imageProxyHosts(dev).includes(hostname);
}

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

export function buildOptimizedUrl(src: string, width?: number): string {
  const params = new URLSearchParams({ url: src, q: QUALITY.toString() });
  if (width) params.set('w', width.toString());
  return `/img?${params.toString()}`;
}

/** 이미지가 고를 후보 폭. 호출부가 폭을 지어내지 않도록 여기 한 곳에 둔다. */
const WIDTH_LADDER = [160, 320, 480, 640, 960, 1280, 1920];

/**
 * 후보 폭을 전부 깔고 브라우저가 고르게 한다 — 호출부의 `sizes` 와 기기 DPR 로 계산한다.
 * 고정 폭이어도 `sizes="160px"` 이면 되므로 밀도(1x·2x) 경로를 따로 두지 않는다.
 * `src` 는 srcSet 을 못 읽는 브라우저용 폴백이라 사다리의 중간값을 준다.
 */
export function buildResponsiveSrcSet(src: string) {
  return {
    src: buildOptimizedUrl(src, 640),
    srcSet: WIDTH_LADDER.map((w) => `${buildOptimizedUrl(src, w)} ${w}w`).join(
      ', ',
    ),
  };
}
