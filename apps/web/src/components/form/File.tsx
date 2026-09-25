import { CircleX } from 'lucide-react';
import type { ChangeEventHandler, MouseEventHandler } from 'react';
import type { FieldValues, RegisterOptions } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';
import type { EditorFile, LocalFile } from '@/types/form';

interface FilePickerProps {
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
  multiple?: boolean;
}

export default function FilePicker({
  name,
  rules,
  multiple = true,
}: FilePickerProps) {
  const { control } = useFormContext();
  const {
    field: { value: files, onChange },
  } = useController({ name, rules, control });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files === null) return;

    const newFiles: LocalFile[] = Array.from(e.target.files, (file) => ({
      type: 'LOCAL_FILE',
      file,
    }));

    onChange([...files, ...newFiles]);

    // 같은 파일에 대해서 선택이 가능하도록 처리
    // https://stackoverflow.com/a/12102992
    e.target.value = '';
  };

  const deleteFileAtIndex = (index: number) => {
    const nextFiles = [...files];
    nextFiles.splice(index, 1);
    onChange(nextFiles);
  };

  return (
    <div className={`flex gap-3 ${multiple && 'flex-col'}`}>
      <SelectFileButton onChange={handleChange} multiple={multiple} />
      <ol className="self-start rounded-xs border border-neutral-200 bg-neutral-50">
        {(files as EditorFile[]).map((item, idx) => (
          <FilePickerRow
            key={idx}
            file={item}
            deleteFile={(e) => {
              e.preventDefault();
              deleteFileAtIndex(idx);
            }}
          />
        ))}
      </ol>
    </div>
  );
}

function SelectFileButton({
  onChange,
  multiple,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
  multiple: boolean;
}) {
  return (
    <label className="mr-3 flex h-8 cursor-pointer items-center self-start rounded-xs border border-neutral-300 px-3 type-label hover:bg-neutral-100">
      파일 선택
      <input
        type="file"
        className="hidden"
        onChange={onChange}
        multiple={multiple}
      />
    </label>
  );
}

interface FileRowProps {
  file: EditorFile;
  deleteFile: MouseEventHandler<HTMLButtonElement>;
}

function FilePickerRow({ file, deleteFile }: FileRowProps) {
  return (
    <li className="flex h-7.5 w-130 items-center border-b border-dashed border-neutral-200 px-3 last:border-none">
      <p className="mr-4 type-ui">{file.file.name}</p>
      <button
        type="button"
        // 아이콘 20px, 클릭 영역 24px — 음수 마진으로 배치는 그대로.
        className="-m-0.5 ml-auto p-0.5 text-neutral-500 hover:text-neutral-700"
        onClick={deleteFile}
      >
        <CircleX className="size-5" />
      </button>
    </li>
  );
}
