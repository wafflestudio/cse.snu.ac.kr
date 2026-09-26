import type { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import HTMLEditor from '@/components/form/html/HTMLEditor';

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

function SampleEditor() {
  const methods = useForm({
    defaultValues: {
      body: '<p>본문 견본입니다. <strong>굵게</strong>와 <a href="#editor">링크</a>.</p>',
    },
  });
  return (
    <FormProvider {...methods}>
      <HTMLEditor name="body" />
    </FormProvider>
  );
}

export function EditorSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="편집기 겉모양">
        <SampleEditor />
        <ul className="list-disc space-y-1 pl-5">
          <li>
            겉 테두리 neutral-300, 모서리 2px — 다른 입력 칸(입력·폼 절)과 같다.
          </li>
          <li>
            툴바 버튼 묶음 테두리 neutral-200·모서리 2px, 버튼 호버 neutral-200,
            툴바 바탕 neutral-50.
          </li>
          <li>툴바 글자(크기·문단 형식)도 사이트 서체.</li>
          <li>
            편집 영역의 본문은 뷰어와 같은 CSS를 쓴다(읽기 폭 640·14/28). 그래서
            편집기에서 고른 글자 크기는 뷰어에서도 같은 크기로 보인다.
          </li>
          <li>
            이 절은 겉모양만 정한다. 툴바 구성·붙여넣기 정리·CSP 동작은 기능이라
            바꾸지 않는다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
