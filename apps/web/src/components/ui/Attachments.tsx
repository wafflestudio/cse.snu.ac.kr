import type { Attachment } from '@/types/api';
import { formatBytes } from '@/utils/string';
import ClipIcon from './assets/clip.svg?react';

interface AttachmentsProps {
  files: Attachment[];
}

export default function Attachments({ files }: AttachmentsProps) {
  if (files.length === 0) return null;

  const variantSpacing = 'mb-8 mt-3 py-3 pl-4 pr-16 sm:mb-12 sm:mt-6 sm:pr-32';

  return (
    <div
      className={`relative flex flex-col gap-2 self-start border border-neutral-200 bg-white sm:w-auto sm:max-w-fit ${variantSpacing}`}
    >
      {files.map((file, index) => {
        const byteStr = formatBytes(file.bytes);
        const key = `${file.url}-${index}`;

        return (
          <a
            key={key}
            className="flex type-ui hover:text-main-orange"
            href={encodeURI(file.url)}
            download={file.name}
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {file.name}
            </span>
            <span className="ml-2">({byteStr})</span>
          </a>
        );
      })}

      <ClipIcon className="absolute right-2 -top-6" />
    </div>
  );
}
