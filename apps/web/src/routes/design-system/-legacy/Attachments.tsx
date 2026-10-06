import ClipIcon from '@/components/ui/assets/clip.svg?react';
import { formatBytes } from '@/utils/string';
import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/components/ui/Attachments.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 첨부 파일 상자. 내려받기·새 탭은 빼고 링크는 누르면 이동하지 않는 <a> 로 바꿨다(클립 그림은 지금과 같은 파일).
// 예전 값: 모서리 4px, 13px, 호버하면 밑줄만 생긴다.
export function LegacyAttachments({
  files,
}: {
  files: { name: string; bytes: number }[];
}) {
  const variantSpacing =
    'mb-9 mt-3 py-3 pl-4 pr-20 sm:mb-11 sm:mt-5 sm:pr-[10rem]';

  return (
    <div
      className={`relative flex flex-col gap-2 self-start rounded-sm border border-neutral-200 bg-white sm:w-auto sm:max-w-fit ${variantSpacing}`}
    >
      {files.map((file) => (
        <a
          key={file.name}
          className="flex text-sm font-normal hover:underline"
          href="/design-system"
          onClick={stay}
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {file.name}
          </span>
          <span className="ml-2">({formatBytes(file.bytes)})</span>
        </a>
      ))}

      <ClipIcon className="absolute right-2 -top-6" />
    </div>
  );
}
