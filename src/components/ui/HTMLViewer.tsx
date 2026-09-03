import './assets/suneditor-contents.css';

import clsx from 'clsx';
import Image from '@/components/ui/Image';
import { useNonce } from '@/hooks/useNonce';
import useIsMobile from '@/hooks/useResponsive';
import { type Falsy, isNotFalsy } from '@/types/utils';
import type { ProcessedHtml } from '@/utils/csp';

interface TopRightImage {
  src: string;
  width: 200 | 240 | 320;
  height: number;
  mobileFullWidth?: boolean;
}

interface HTMLViewerProps {
  html: ProcessedHtml;
  image?: TopRightImage | Falsy;
  component?: React.ReactNode | Falsy;
}

export default function HTMLViewer({
  html,
  image,
  component,
}: HTMLViewerProps) {
  const isMobile = useIsMobile();
  const nonce = useNonce();

  const { html: trimmedHTML, cssRules } = html;

  // image width 계산
  const hasImage = isNotFalsy(image);
  const imageWidth = hasImage
    ? isMobile && image.mobileFullWidth
      ? undefined
      : image?.width
    : undefined;

  const hasComponent = isNotFalsy(component);

  return (
    <div className="flow-root">
      {hasImage && (
        <div
          className={clsx(
            'relative mb-7 w-full sm:float-right sm:ml-7',
            imageWidth ? IMAGE_WIDTH_CLASS[imageWidth] : null,
          )}
        >
          <Image
            src={image.src}
            alt="대표 이미지"
            width={image.width}
            height={image.height}
            className="w-full object-contain"
          />
        </div>
      )}
      {hasComponent && <div className="relative float-right">{component}</div>}
      <div
        className="sun-editor-editable"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML 콘텐츠 렌더링 필요
        dangerouslySetInnerHTML={{ __html: trimmedHTML }}
      />
      {/* strict CSP: <style precedence>는 React가 head로 hoisting하며, hoisted style의 nonce를
          "렌더옵션의 style nonce"로만 채운다. 그런데 react-dom은 렌더 nonce가 문자열이면 script용으로만
          쓰고 style nonce는 비운다(객체 {script,style}여야 style도 채움). TanStack은 ssr.nonce(문자열)를
          그대로 React 렌더에 넘기므로 hoisted style이 nonce 없이 나가 → strict CSP(style-src 'nonce-…')에
          막힌다(처리된 인라인 폰트 크기 등이 소실). precedence를 빼면 in-place 렌더라 JSX nonce가 그대로
          출력 → CSP 통과 → 적용된다. (정석은 TanStack이 {script,style} nonce를 렌더에 넘기는 것.) */}
      {cssRules.length > 0 && <style nonce={nonce}>{cssRules}</style>}
    </div>
  );
}

const IMAGE_WIDTH_CLASS: Record<TopRightImage['width'], string> = {
  200: 'sm:w-[200px]',
  240: 'sm:w-[240px]',
  320: 'sm:w-[320px]',
};
