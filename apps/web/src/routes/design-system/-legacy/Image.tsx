import type { ChangeEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

// d1baf83c 의 apps/web/src/components/form/Image.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 예전 사진 고르기: 높이 30·12px 테두리 단추, 고른 사진은 옅은 회색 상자에 이름(크기)과 밑줄 "삭제".
// 견본은 서버에 올린 사진(UPLOADED_IMAGE) 경로를 빼고, 고른 파일은 /img 대신 바로 미리 본다.
export function LegacyImagePicker({ name }: { name: string }) {
  const { register, setValue } = useFormContext();
  register(name);
  const file = useWatch({ name }) as { file: File } | null;
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file.file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) return;
    setValue(name, { type: 'LOCAL_IMAGE', file: e.target.files[0] });
  };

  return (
    <>
      <label className="mb-3 flex h-7.5 w-fit cursor-pointer items-center self-start rounded-sm border border-neutral-300 px-[.62rem] text-xs hover:bg-neutral-100">
        {`이미지 ${file ? '변경' : '업로드'}`}
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          className="hidden"
          onChange={handleChange}
        />
      </label>
      {file && url && (
        <div className="relative flex gap-3 self-start rounded-sm border border-neutral-200 bg-neutral-50 pb-2 pl-2 pr-4 pt-2">
          <img src={url} alt="선택된 이미지" width={100} />
          <div className="flex flex-col items-start justify-between">
            <p className="text-xs">{`${file.file.name}(${Math.floor(file.file.size / 100) / 10}KB)`}</p>
            <button
              type="button"
              className="text-xs underline"
              onClick={() => setValue(name, null)}
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </>
  );
}
