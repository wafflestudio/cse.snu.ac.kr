import { api } from '@/utils/api';
import 'suneditor/src/assets/css/suneditor.css';
import 'suneditor/src/assets/css/suneditor-contents.css';
import '@/components/ui/assets/suneditor-contents.override.css';
import './suneditor.override.css';

import { useEffect, useState } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import type SunEditorCore from 'suneditor/src/lib/core';

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

// SunEditor 는 strict CSP 를 지원하지 않아 하는 우회다(JiHong88/SunEditor#1572, 답 없이 닫힘).
// 툴바(색 팔레트·글자 크기 목록)와 본문을 innerHTML 로 그리는데, style-src 에 unsafe-inline 이 없으면
// 그 style 속성이 적용되지 않는다. nonce 는 style 속성에 듣지 않으므로 CSSOM(style.cssText)으로 다시 넣는다.
// 화면만의 문제가 아니다. 서식을 바꿀 때 style.cssText 를 읽어 합치므로, 막힌 채면 기존 색이 저장본에서 사라진다.
// 판정은 "속성값 ≠ cssText". 다시 넣으면 둘이 같아져(#f00 → rgb(255, 0, 0)) 관찰자가 자기 변경에 반응하지 않는다.
// style.length 로 판정하면 안 된다. 막힌 setAttribute 는 이전 선언을 남겨 0이 아니다.
// SunEditor 를 올릴 때 context.element.topArea 가 툴바·본문을 함께 감싸는지 확인한다.
const restoreBlockedStyles = (root: HTMLElement) => {
  const restore = (el: HTMLElement) => {
    const style = el.getAttribute('style');
    if (style && style !== el.style.cssText) el.style.cssText = style;
  };
  const restoreTree = (el: HTMLElement) => {
    restore(el);
    for (const child of el.querySelectorAll<HTMLElement>('[style]')) {
      restore(child);
    }
  };

  restoreTree(root);
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'attributes') restore(record.target as HTMLElement);
      for (const node of record.addedNodes) {
        if (node instanceof Element) restoreTree(node as HTMLElement);
      }
    }
  });
  observer.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['style'],
  });
  return observer;
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
    let styleObserver: MutationObserver | null = null;

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
          check_new_window: 'noreferrer noopener',
        },
        // TODO: 성능 이슈 있을지 확인
        historyStackDelayTime: 0,
        // SunEditor 자체의 태그·스타일 정리를 끈다. 본문 규칙은 백엔드 세탁기 하나만 갖는다 —
        // 붙여넣기는 그 결과를 그대로 넣고, 기존 글을 열 때도 스타일이 깎이지 않는다.
        strictMode: false,
      });

      styleObserver = restoreBlockedStyles(
        editor.core.context.element.topArea as HTMLElement,
      );
      editor.onImageUploadBefore = handleImageUploadBefore;
      editor.onPaste = handlePaste;
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
      styleObserver?.disconnect();
      _editor?.destroy();
      return;
    };
  }, [div, getValues, name, onBlur, setValue]);

  if (isHidden) return null;

  return <div ref={setDiv} />;
}

/**
 * 붙여넣은 HTML 을 백엔드의 세탁기에 먼저 통과시킨다.
 *
 * 저장 시점에 백엔드가 같은 함수로 세탁하지만, 편집 중 화면이 저장될 모습과 같아야 한다.
 * 원문을 그대로 보내야 숨은 요소를 통째로 지우고 base64 이미지를 파일로 뺄 수 있다.
 *
 * 서버에 못 닿으면 원문을 그대로 넣는다. 실행은 CSP 가 막고, 저장 때 백엔드가 세탁한다.
 */
const handlePaste: SunEditorCore['onPaste'] = (e, _cleanData, _max, core) => {
  const clipboard = (e as ClipboardEvent).clipboardData;
  const html = clipboard?.getData('text/html');
  if (!clipboard || !html) return true; // 평문은 SunEditor 기본 동작

  // SunEditor 는 파일이 있으면 이미지 삽입으로 처리한다. 단 MS Office 는 파일이 딸려 와도 HTML 로 본다.
  const fromMsOffice =
    /class=["']?Mso|content=["']?(Word|OneNote|Excel)\./i.test(html);
  if (clipboard.files.length > 0 && !fromMsOffice) return true;

  api
    .post('v2/content/sanitize', {
      body: html,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
    .text()
    .then(
      (sanitized) => core.functions.insertHTML(sanitized),
      () => core.functions.insertHTML(html),
    );
  return false;
};

// @ts-expect-error suneditor 내부 타입
const handleImageUploadBefore = (files, _info, _core, uploadHandler) => {
  const formData = new FormData();
  // @ts-expect-error suneditor 내부 타입
  files.forEach((file, idx) => {
    const ext = file.name.split('.').pop();
    const newFile = new File([file], `file-${idx}.${ext}`);
    formData.append(newFile.name, newFile);
  });

  api
    .post('v1/file/upload', { body: formData })
    .json()
    .then((resp) => {
      uploadHandler(resp);
    })
    // suneditor는 에러를 문자열로 받아 에디터에 표시한다.
    .catch((reason) => uploadHandler(`${reason}`));

  return undefined;
};
