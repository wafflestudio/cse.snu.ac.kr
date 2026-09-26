import { FormProvider, useForm } from 'react-hook-form';
import HTMLEditor from '@/components/form/html/HTMLEditor';
import {
  DocSection,
  Example,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 에디터 페이지. 실제 HTMLEditor 를 그린다 — 테두리·툴바 색은 override CSS 가 정하므로 적지 않는다.

function SampleEditor() {
  const methods = useForm({
    defaultValues: {
      body: '<p>본문 견본입니다. <strong>굵게</strong>와 <a href="#editor">링크</a>.</p>',
    },
  });
  return (
    <FormProvider {...methods}>
      <div className="w-full">
        <HTMLEditor name="body" />
      </div>
    </FormProvider>
  );
}

export function EditorSection() {
  return (
    <>
      <Lead>
        에디터는 게시물 본문을 쓰는 칸이다. 이 페이지는 겉모양만 정한다 — 툴바
        구성·붙여넣기 정리·CSP 동작은 기능이라 여기서 바꾸지 않는다.
      </Lead>

      <DocSection title="예시">
        <Example caption="편집 영역의 본문은 뷰어와 같은 CSS를 쓴다 — 편집기에서 고른 글자 크기가 뷰어에서도 같게 보인다.">
          <SampleEditor />
        </Example>
      </DocSection>

      <DocSection title="겉모양을 고칠 때">
        <RuleList
          items={[
            '겉 테두리와 모서리는 다른 입력 칸(입력·폼)과 같게 둔다.',
            '툴바 글자(크기·문단 형식)도 사이트 서체를 쓴다.',
            '편집 영역의 본문 CSS를 뷰어와 따로 두지 않는다.',
          ]}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['form', '입력·폼'],
            ['reading', '읽는 본문·이미지'],
          ]}
        />
      </DocSection>
    </>
  );
}
