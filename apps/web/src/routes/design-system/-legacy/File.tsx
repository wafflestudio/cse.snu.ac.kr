import type { ChangeEventHandler } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { EditorFile, LocalFile } from '@/types/form';

// d1baf83c 의 apps/web/src/components/form/File.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 첨부 파일 고르기. 지우기 아이콘(form/assets/clear_icon.svg)은 지금 없는 파일이라 그대로 옮겨 그렸다.
// 예전 값: 파일 줄 폭 520px 고정·높이 30·점선 구분, 이름은 줄임 없이 한 줄, 파일 선택은 12px 테두리 단추.
export function LegacyFilePicker({ name }: { name: string }) {
  const { control } = useFormContext();
  const {
    field: { value: files, onChange },
  } = useController({ name, control });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files === null) return;
    const newFiles: LocalFile[] = Array.from(e.target.files, (file) => ({
      type: 'LOCAL_FILE',
      file,
    }));
    onChange([...files, ...newFiles]);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="mr-3 flex h-8 cursor-pointer items-center self-start rounded-sm border border-neutral-300 px-[.62rem] text-xs hover:bg-neutral-100">
        파일 선택
        <input
          type="file"
          className="hidden"
          onChange={handleChange}
          multiple
        />
      </label>
      <ol className="self-start rounded-sm border border-neutral-200 bg-neutral-50">
        {(files as EditorFile[]).map((item, idx) => (
          <li
            key={idx}
            className="flex h-7.5 w-[520px] items-center border-b border-dashed border-neutral-200 px-3 last:border-none"
          >
            <p className="mr-4 text-sm">{item.file.name}</p>
            <button
              type="button"
              className="ml-auto"
              aria-label="파일 지우기"
              onClick={(e) => {
                e.preventDefault();
                const next = [...files];
                next.splice(idx, 1);
                onChange(next);
              }}
            >
              <ClearIcon />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ClearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 16 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8.00156 14.4152C4.50666 14.4152 1.60156 11.5101 1.60156 8.01523C1.60156 4.51406 4.50039 1.61523 7.99529 1.61523C11.4965 1.61523 14.4016 4.51406 14.4016 8.01523C14.4016 11.5101 11.5027 14.4152 8.00156 14.4152Z"
        fill="#A3A3A3"
      />
      <path
        d="M6.26989 10.5C6.16949 10.6004 6.03773 10.6506 5.89342 10.6506C5.60479 10.6506 5.37891 10.4185 5.37891 10.1298C5.37891 9.9918 5.4291 9.86003 5.52949 9.76591L7.26753 8.0216L5.52949 6.28356C5.4291 6.18317 5.37891 6.05768 5.37891 5.91964C5.37891 5.62474 5.60479 5.40513 5.89342 5.40513C6.03773 5.40513 6.15067 5.45532 6.25106 5.54944L8.00165 7.29376L9.76479 5.54317C9.87146 5.4365 9.9844 5.39258 10.1224 5.39258C10.4111 5.39258 10.6432 5.61846 10.6432 5.90709C10.6432 6.0514 10.5993 6.16434 10.4864 6.27728L8.74204 8.0216L10.4801 9.75964C10.5868 9.85376 10.6369 9.98552 10.6369 10.1298C10.6369 10.4185 10.4048 10.6506 10.1099 10.6506C9.96557 10.6506 9.83381 10.6004 9.73969 10.5L8.00165 8.75572L6.26989 10.5Z"
        fill="white"
      />
    </svg>
  );
}
