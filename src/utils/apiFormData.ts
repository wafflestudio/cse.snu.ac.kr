import type { EditorFile, EditorImage } from '@/types/form';
import { isFalsy } from '@/types/utils';

/**
 * 백엔드 multipart 규약을 아는 FormData. 이 API는 두 가지 관례가 있다:
 *  1. JSON 본문은 `request` 파트에 **Blob(application/json)** 으로 — 문자열로 넣으면 415.
 *  2. 파일은 **LOCAL(새로 고른 것)만** 전송 — UPLOADED는 서버에 이미 있어 재전송하면 중복된다.
 * FormData를 상속하므로 `api.post(path, { body })`에 그대로 넘길 수 있다.
 */
export class ApiFormData extends FormData {
  appendJson(key: string, value: unknown) {
    this.append(
      key,
      new Blob([JSON.stringify(value)], { type: 'application/json' }),
    );
  }

  appendIfLocal(key: string, value: EditorImage | EditorFile | EditorFile[]) {
    if (Array.isArray(value)) {
      for (const file of value) {
        this.appendIfLocal(key, file);
      }
      return;
    }
    if (isFalsy(value)) return;
    if (value.type === 'LOCAL_FILE' || value.type === 'LOCAL_IMAGE') {
      this.append(key, value.file);
    }
  }
}

/**
 * 수정 요청의 `deleteIds` — 편집 전에는 있었는데 지금은 없는 첨부의 id.
 * (백엔드는 "남길 것"이 아니라 "지울 것"을 받는다.)
 */
export const getDeleteIds = ({
  prev,
  cur,
}: {
  prev: EditorFile[];
  cur: EditorFile[];
}) => {
  const ids = (files: EditorFile[]) =>
    new Set(
      files.flatMap((file) =>
        file.type === 'UPLOADED_FILE' ? [file.file.id] : [],
      ),
    );

  return [...ids(prev).difference(ids(cur))];
};
