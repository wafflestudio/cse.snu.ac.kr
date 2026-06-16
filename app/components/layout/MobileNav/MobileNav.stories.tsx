import type { Decorator, Meta, StoryObj } from '@storybook/tanstack-react';
import { useEffect } from 'react';
import { navigationTree } from '~/constants/navigation';
import { useStore } from '~/store';
import MobileNav from './index';

// MobileNav는 navbarState.type === 'hovered'일 때만, 그리고 `sm:hidden`이라
// 모바일 뷰포트(<640px)에서만 렌더된다. 둘 다 스토리에서 세팅.
// (라우터 컨텍스트는 프레임워크 제공.)
const withHoveredNav: Decorator = function HoveredNavDecorator(Story) {
  useEffect(() => {
    const about = navigationTree.find((i) => i.key === '소개');
    if (about)
      useStore.setState({ navbarState: { type: 'hovered', navItem: about } });
    return () => useStore.setState({ navbarState: { type: 'closed' } });
  }, []);
  return <Story />;
};

const meta = {
  title: 'Layout/MobileNav',
  component: MobileNav,
  decorators: [withHoveredNav],
  parameters: {
    layout: 'fullscreen',
    // SB10 코어 viewport(별도 애드온 불필요)로 모바일 폭 고정 → sm:hidden 해제.
    viewport: {
      options: {
        mobile390: {
          name: 'Mobile 390',
          styles: { width: '390px', height: '760px' },
        },
      },
    },
  },
  globals: { viewport: { value: 'mobile390' } },
} satisfies Meta<typeof MobileNav>;
export default meta;

/** 소개 메뉴를 탭한 상태의 모바일 내비 드로어(목록 + 상세). */
export const Open: StoryObj<typeof meta> = {};
