import { FormProvider, useForm } from 'react-hook-form';
import HTMLEditor from '@/components/form/html/HTMLEditor';
import { DocSection, Example, Lead, RuleList } from '../-components/doc';

// 에디터 페이지. 실제 HTMLEditor 를 그린다. 테두리·툴바 색은 override CSS 가 정하므로 적지 않는다.

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
      <Lead>에디터는 게시물 본문을 쓰는 입력 칸입니다.</Lead>

      <DocSection title="예시">
        <Example caption="쓰는 중인 본문은 게시된 글과 같은 모양입니다.">
          <SampleEditor />
        </Example>
      </DocSection>

      <DocSection title="사용하는 경우">
        <RuleList
          items={[
            '서식(제목·목록·링크·표·이미지)이 필요한 본문(공지·새 소식·세미나, 소개 글)에 씁니다.',
          ]}
        />
      </DocSection>

      <DocSection title="사용하지 않는 경우">
        <RuleList
          items={[
            '한 줄 값이나 서식 없는 짧은 설명은 글자·긴 글 칸을 씁니다. 에디터는 툴바만큼 무겁고, 서식이 섞이면 목록·카드에서 모양이 어긋납니다.',
          ]}
        />
      </DocSection>
    </>
  );
}
