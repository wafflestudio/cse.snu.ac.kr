import { CircleX } from 'lucide-react';
import type { ChangeEventHandler, MouseEventHandler } from 'react';
import { useRef } from 'react';
import type { FieldValues, RegisterOptions } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';
import Button from '@/components/ui/Button';
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
      <ol className="w-full max-w-120 self-start rounded-xs border border-neutral-200 bg-neutral-50 empty:hidden">
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
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="self-start">
      <Button variant="secondary" onClick={() => inputRef.current?.click()}>
        파일 선택
      </Button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={onChange}
        multiple={multiple}
      />
    </div>
  );
}

interface FileRowProps {
  file: EditorFile;
  deleteFile: MouseEventHandler<HTMLButtonElement>;
}

function FilePickerRow({ file, deleteFile }: FileRowProps) {
  return (
    <li className="flex h-8.5 items-center justify-between gap-4 border-b border-neutral-200 px-3 last:border-none">
      <p className="min-w-0 truncate type-ui">{file.file.name}</p>
      <Button variant="text" ariaLabel="파일 지우기" onClick={deleteFile}>
        <CircleX className="size-5" />
      </Button>
    </li>
  );
}
