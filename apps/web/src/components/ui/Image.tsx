import type { ImgHTMLAttributes, SyntheticEvent } from 'react';
import { useState } from 'react';
import SnuLogo from '@/components/layout/LeftNav/assets/SNU_Logo.svg?react';
import { buildResponsiveSrcSet, shouldOptimize } from '@/utils/imageUrl';

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'sizes'> & {
  src?: string | null;
  /**
   * 표시 폭. 없으면 브라우저가 100vw 로 가정해 늘 가장 큰 후보를 받는다.
   * 고정 폭이면 `"160px"`, 변하면 `"(min-width: 640px) 200px, 100vw"`.
   */
  sizes: string;
  /** LCP 요소일 때. 즉시 받고 우선순위를 올린다 — 둘을 따로 쓰면 한쪽을 빠뜨린다. */
  priority?: boolean;
};

/**
 * 로드 실패·src 없음이면 로고 플레이스홀더. 최적화 URL 조립은 utils/imageUrl.
 * `width`·`height` 는 선택 — 받을 파일이 아니라 레이아웃 예약(CLS)에만 쓰인다.
 */
export default function Image({
  src: _src,
  onError,
  width,
  priority,
  height,
  className,
  ...props
}: ImageProps) {
  const [prevSrc, setPrevSrc] = useState(_src);
  const [hasError, setHasError] = useState(false);

  if (prevSrc !== _src) {
    setPrevSrc(_src);
    setHasError(false);
  }

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.(event);
  };

  if (hasError || !_src) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 ${
          className ?? ''
        }`}
        {...props}
      >
        <SnuLogo className="h-[60px] w-[60px] fill-neutral-200" />
      </div>
    );
  }

  // 최적화 대상(원격 래스터)이 아니면 원본 그대로.
  const { src, srcSet } = shouldOptimize(_src)
    ? buildResponsiveSrcSet(_src)
    : { src: _src, srcSet: undefined };

  return (
    <img
      {...props}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      src={src}
      srcSet={srcSet}
      alt={props.alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}
