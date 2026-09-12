import type { FieldValues, RegisterOptions } from 'react-hook-form';
import type { Falsy } from '@/types/utils';

export type Rules =
  | Omit<
      RegisterOptions<FieldValues, string>,
      'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
    >
  | undefined;

export type EditorFile = LocalFile | UploadedFile;

export interface LocalFile {
  type: 'LOCAL_FILE';
  file: File;
}

interface UploadedFile {
  type: 'UPLOADED_FILE';
  file: {
    id: number;
    name: string;
    url: string;
    bytes: number;
  };
}

export const isLocalFile = (file: EditorFile): file is LocalFile =>
  file.type === 'LOCAL_FILE';

export type EditorImage = LocalImage | UploadedImage | Falsy;

export interface LocalImage {
  type: 'LOCAL_IMAGE';
  file: File;
}

export interface UploadedImage {
  type: 'UPLOADED_IMAGE';
  url: string;
}
