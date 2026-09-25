import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { ButtonSection } from './-sections/button';
import { ColorSection } from './-sections/color';
import { DialogSection } from './-sections/dialog';
import { FormSection } from './-sections/form';
import { GraphicSection } from './-sections/graphic';
import { IconSection } from './-sections/icon';
import { LayoutSection } from './-sections/layout';
import { SearchSection } from './-sections/search';
import { SelectionSection } from './-sections/selection';
import { ShapeSection } from './-sections/shape';
import { SpacingSection } from './-sections/spacing';
import { TypeSection } from './-sections/type';

// 디자인 규칙의 정본. 영역은 SECTIONS 순서대로 이 한 페이지에 쌓는다.
// 규칙은 이 페이지의 값과 실제 컴포넌트로 보여주고, 토큰 사본이나 손으로 그린 모형을 만들지 않는다.

type Section = { id: string; title: string; content?: ReactNode };
type Group = { title: string; sections: Section[] };

const GROUPS: Group[] = [
  {
    title: '기반',
    sections: [
      { id: 'layout', title: '레이아웃·반응형', content: <LayoutSection /> },
      { id: 'color', title: '색', content: <ColorSection /> },
      { id: 'type', title: '글자', content: <TypeSection /> },
      { id: 'spacing', title: '간격', content: <SpacingSection /> },
      { id: 'shape', title: '모서리·그림자·선', content: <ShapeSection /> },
      { id: 'icon', title: '아이콘', content: <IconSection /> },
      { id: 'graphic', title: '그래픽', content: <GraphicSection /> },
    ],
  },
  {
    title: '컴포넌트',
    sections: [
      { id: 'button', title: '버튼', content: <ButtonSection /> },
      { id: 'form', title: '입력·폼', content: <FormSection /> },
      { id: 'selection', title: '선택·태그', content: <SelectionSection /> },
      { id: 'dialog', title: '모달', content: <DialogSection /> },
      { id: 'search', title: '검색 입력', content: <SearchSection /> },
      { id: 'toast', title: '토스트' },
      { id: 'editor', title: '에디터' },
    ],
  },
  {
    title: '패턴',
    sections: [
      { id: 'page', title: '페이지 틀' },
      { id: 'navigation', title: '내비게이션·셸' },
      { id: 'list', title: '목록·상태 화면' },
      { id: 'post', title: '게시물 상세' },
      { id: 'reading', title: '읽는 본문·이미지' },
      { id: 'main', title: '메인·카테고리' },
      { id: 'unique', title: '고유 화면' },
      { id: 'writing', title: '문구' },
    ],
  },
];

function DesignSystemPage() {
  return (
    <PageLayout
      title="디자인 시스템"
      breadcrumb={[]}
      pageTitle="디자인 시스템"
      pageDescription="서울대학교 컴퓨터공학부 웹사이트의 디자인 규칙"
    >
      <Identity />
      <Contents />
      {GROUPS.flatMap((group) =>
        group.sections.map((section) => (
          <DocSection key={section.id} {...section} />
        )),
      )}
    </PageLayout>
  );
}

function Identity() {
  return (
    <section className="mb-16 max-w-xl break-keep">
      <h2 className="text-2xl font-bold">추상의 구상</h2>
      <p className="mt-4 text-md leading-7 text-neutral-700">
        컴퓨터공학은 0과 1에서 출발해 추상화의 층위를 쌓아갑니다. 하나의 구조가
        다음 층위의 단위가 되고, 그 위에 더 복잡한 시스템이 세워집니다.
      </p>
      <p className="mt-4 text-md leading-7 text-neutral-700">
        서울대학교 컴퓨터공학부의 디자인은 이 사고방식을 시각 언어로 옮깁니다.
        간결한 형태가 정보를 담는 단위가 되고, 단위 사이의 관계가 화면의 질서를
        만듭니다. 정보를 구성하는 방식에 학문의 정체성을 담습니다.
      </p>
      <p className="mt-6 text-sm text-neutral-500">
        이 페이지가 디자인 규칙의 정본입니다. 화면을 만들 때 여기에 없는 값이나
        모양을 새로 만들지 않습니다.
      </p>
    </section>
  );
}

function Contents() {
  return (
    <nav aria-label="목차" className="mb-16 grid gap-8 sm:grid-cols-3">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-3 text-md font-bold">{group.title}</p>
          <ol className="space-y-2 text-md">
            {group.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-neutral-700 hover:text-main-orange"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </nav>
  );
}

function DocSection({ id, title, content }: Section) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-neutral-200 py-12">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-6">
        {content ?? <p className="text-md text-neutral-500">준비 중입니다.</p>}
      </div>
    </section>
  );
}

export const Route = createFileRoute('/design-system/')({
  component: DesignSystemPage,
});
