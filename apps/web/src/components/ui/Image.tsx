import type { ImgHTMLAttributes, SyntheticEvent } from 'react';
import { useState } from 'react';
import SnuLogo from '@/components/layout/LeftNav/assets/SNU_Logo.svg?react';
import {
  buildOptimizedUrl,
  buildResponsiveSrc,
  shouldOptimize,
} from '@/utils/imageUrl';

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null;
  quality?: number;
  width?: number;
};

/** 로드 실패·src 없음이면 로고 플레이스홀더. 최적화 URL 조립은 utils/imageUrl. */
export default function Image({
  src: _src,
  onError,
  quality,
  width,
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

  // 최적화 대상이 아니면 원본 그대로. width가 있으면 1x·2x·3x srcSet까지.
  const { src, srcSet } = !shouldOptimize(_src)
    ? { src: _src, srcSet: undefined }
    : width
      ? buildResponsiveSrc(_src, width, quality)
      : { src: buildOptimizedUrl(_src, quality), srcSet: undefined };

  return (
    <img
      {...props}
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
