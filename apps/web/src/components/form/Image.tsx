import { CircleX } from 'lucide-react';
import type { ChangeEventHandler, MouseEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import type { LocalImage, UploadedImage } from '@/types/form';

interface Props {
  name: string;
  options?: RegisterOptions;
}

export default function ImagePicker({ name, options }: Props) {
  const { register, setValue } = useFormContext();
  register(name, options);
  const file = useWatch({ name });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) return;
    setValue(name, { type: 'LOCAL_IMAGE', file: e.target.files[0] });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="self-start">
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
          {`이미지 ${file ? '변경' : '업로드'}`}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".png, .jpg, .jpeg"
          className="hidden"
          onChange={handleChange}
        />
      </div>
      {file && (
        <SelectedImageViewer
          file={file}
          removeFile={() => setValue(name, null)}
        />
      )}
    </div>
  );
}

const IMAGE_WIDTH = 100;

const SelectedImageViewer = ({
  file,
  removeFile,
}: {
  file: LocalImage | UploadedImage;
  removeFile: () => void;
}) => {
  const [imageHeight, setImageHeight] = useState(45);

  useEffect(() => {
    if (!file || file.type !== 'LOCAL_IMAGE') return;
    (async () => {
      const bmp = await createImageBitmap(file.file);
      setImageHeight(Math.round((IMAGE_WIDTH / bmp.width) * bmp.height));
    })();
  }, [file]);

  if (file.type !== 'LOCAL_IMAGE') {
    return (
      <div className="flex w-fit items-start gap-3 self-start rounded-xs border border-neutral-200 bg-neutral-50 p-2">
        <Image
          src={file.url}
          alt="선택한 이미지"
          width={100}
          height={100}
          sizes="100px"
        />
        <Button variant="text" ariaLabel="이미지 지우기" onClick={removeFile}>
          <CircleX className="size-5" />
        </Button>
      </div>
    );
  }

  const imageURL = URL.createObjectURL(file.file);
  const fileSizeRounded = Math.floor(file.file.size / 100) / 10;
  const handleDeleteBlob: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    removeFile();
  };

  return (
    <div className="flex items-start gap-3 self-start rounded-xs border border-neutral-200 bg-neutral-50 p-2">
      <Image
        src={imageURL}
        alt="선택한 이미지"
        width={IMAGE_WIDTH}
        sizes={`${IMAGE_WIDTH}px`}
        height={imageHeight}
      />
      <p className="type-meta">{`${file.file.name}(${fileSizeRounded}KB)`}</p>
      <Button
        variant="text"
        ariaLabel="이미지 지우기"
        onClick={handleDeleteBlob}
      >
        <CircleX className="size-5" />
      </Button>
    </div>
  );
};
