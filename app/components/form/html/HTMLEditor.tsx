import './suneditor.css';
import './suneditor-contents.css';

import { useEffect, useState } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import type SunEditorCore from 'suneditor/src/lib/core';

import { BASE_URL } from '~/constants/api';

// https://github.com/JiHong88/SunEditor/issues/199
const isContentEmpty = (editor: SunEditorCore) => {
  const wysiwyg = editor.core.context.element.wysiwyg;

  return (
    editor.util.onlyZeroWidthSpace(wysiwyg.textContent ?? '') &&
    !wysiwyg.querySelector(
      '.se-component, pre, blockquote, hr, li, table, img, iframe, video',
    ) &&
    (wysiwyg.textContent?.match(/\n/g) || '').length <= 1
  );
};

export interface HTMLEditorProps {
  name: string;
  isHidden?: boolean;
  options?: RegisterOptions;
}

export default function HTMLEditor({
  name,
  isHidden,
  options: registerOptions,
}: HTMLEditorProps) {
  const { register, setValue, getValues } = useFormContext();
  const [div, setDiv] = useState<HTMLDivElement | null>(null);
  const { onBlur } = register(name, registerOptions);

  useEffect(() => {
    if (!div) return;
    if (typeof window === 'undefined') return;

    let _editor: SunEditorCore | null = null;

    const initEditor = async () => {
      const { default: suneditor } = await import('suneditor');
      const editor = suneditor.create(div, {
        defaultStyle: 'padding: 1rem',
        minHeight: '400px',
        lang: await import('suneditor/src/lang/').then((m) => m.ko),
        plugins: await import('suneditor/src/plugins').then((m) => m.default),
        buttonList: [
          ['undo', 'redo'],
          ['fontSize', 'formatBlock'],
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          '/', // Line break
          ['fontColor', 'hiliteColor'],
          ['lineHeight', 'align', 'horizontalRule', 'list'],
          ['table', 'link', 'image', 'preview'],
        ],
        imageMultipleFile: true,
        linkRelDefault: {
          // 안전하지 않은 써드파티 링크(target="_blank") 취약점 대응
          // TODO: 복사 붙여넣기 한 경우 대응
          check_new_window: 'noreferrer noopener',
        },
        // TODO: 성능 이슈 있을지 확인
        historyStackDelayTime: 0,
      });

      editor.onImageUploadBefore = handleImageUploadBefore;
      editor.onBlur = onBlur;
      editor.onChange = (contents) => {
        setValue(name, isContentEmpty(editor) ? '' : contents, {
          shouldDirty: true,
        });
      };

      editor.setContents(getValues(name));
      _editor = editor;
    };

    initEditor();

    return () => {
      _editor?.destroy();
      return;
    };
  }, [div, getValues, name, onBlur, setValue]);

  if (isHidden) return null;

  return <div ref={setDiv} />;
}

// @ts-expect-error suneditor 내부 타입
const handleImageUploadBefore = (files, _info, _core, uploadHandler) => {
  const formData = new FormData();
  // @ts-expect-error suneditor 내부 타입
  files.forEach((file, idx) => {
    const ext = file.name.split('.').pop();
    const newFile = new File([file], `file-${idx}.${ext}`);
    formData.append(newFile.name, newFile);
  });

  fetch(`${BASE_URL}/v1/file/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      return response.json();
    })
    .then((resp) => {
      uploadHandler(resp);
    })
    .catch((reason) => uploadHandler(`${reason}`));

  return undefined;
};
