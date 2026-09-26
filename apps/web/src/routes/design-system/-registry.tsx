import type { ReactNode } from 'react';
import type { SubNavConfig } from '@/hooks/useSubNav';
import { ButtonSection } from './-sections/button';
import { ColorSection } from './-sections/color';
import { DialogSection } from './-sections/dialog';
import { EditorSection } from './-sections/editor';
import { FormSection } from './-sections/form';
import { GraphicSection } from './-sections/graphic';
import { IconSection } from './-sections/icon';
import { LayoutSection } from './-sections/layout';
import { ListSection } from './-sections/list';
import { MainSection } from './-sections/main';
import { NavigationSection } from './-sections/navigation';
import { PageSection } from './-sections/page';
import { PostSection } from './-sections/post';
import { ReadingSection } from './-sections/reading';
import { SearchSection } from './-sections/search';
import { SelectionSection } from './-sections/selection';
import { ShapeSection } from './-sections/shape';
import { SpacingSection } from './-sections/spacing';
import { ToastSection } from './-sections/toast';
import { TypeSection } from './-sections/type';
import { UniqueSection } from './-sections/unique';
import { WritingSection } from './-sections/writing';

// 디자인 시스템 문서의 목차 한 곳. 절마다 한 페이지(/design-system/<id>)이고, 묶음은 목차에서만 나뉜다.
// 규칙은 값과 실제 컴포넌트로 보여 주고, 코드는 싣지 않는다 — 코드는 소스가 정본이다.

type Section = { id: string; title: string; content: ReactNode };
type Group = { title: string; description: string; sections: Section[] };

export const GROUPS: Group[] = [
  {
    title: '기반',
    description: '화면을 이루는 값 — 틀·색·글자·간격·모양·아이콘·그래픽.',
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
    description: '여러 화면이 같이 쓰는 부품 — ui/·form/ 의 한 벌.',
    sections: [
      { id: 'button', title: '버튼', content: <ButtonSection /> },
      { id: 'form', title: '입력·폼', content: <FormSection /> },
      { id: 'selection', title: '선택·태그', content: <SelectionSection /> },
      { id: 'dialog', title: '모달', content: <DialogSection /> },
      { id: 'search', title: '검색 입력', content: <SearchSection /> },
      { id: 'toast', title: '토스트', content: <ToastSection /> },
      { id: 'editor', title: '에디터', content: <EditorSection /> },
    ],
  },
  {
    title: '패턴',
    description:
      '부품을 엮는 방식 — 페이지 틀·내비게이션·목록·게시물·본문·문구.',
    sections: [
      { id: 'page', title: '페이지 틀', content: <PageSection /> },
      {
        id: 'navigation',
        title: '내비게이션·셸',
        content: <NavigationSection />,
      },
      { id: 'list', title: '목록·상태 화면', content: <ListSection /> },
      { id: 'post', title: '게시물 상세', content: <PostSection /> },
      { id: 'reading', title: '읽는 본문·이미지', content: <ReadingSection /> },
      { id: 'writing', title: '문구', content: <WritingSection /> },
    ],
  },
  {
    title: '화면',
    description: '이 사이트에만 있는 화면 — 메인·카테고리와 고유 화면.',
    sections: [
      { id: 'main', title: '메인·카테고리', content: <MainSection /> },
      { id: 'unique', title: '고유 화면', content: <UniqueSection /> },
    ],
  },
];

export const SECTIONS = GROUPS.flatMap((group) =>
  group.sections.map((section) => ({ ...section, group: group.title })),
);

export const DS_SUBNAV: SubNavConfig = {
  title: '디자인 시스템',
  titlePath: '/design-system',
  localized: false,
  items: GROUPS.flatMap((group) => [
    { name: group.title, depth: 0 as const },
    ...group.sections.map((section) => ({
      name: section.title,
      path: `/design-system/${section.id}`,
      depth: 1 as const,
    })),
  ]),
};
