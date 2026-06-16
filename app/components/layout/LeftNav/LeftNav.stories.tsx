import type { Meta, StoryObj } from '@storybook/tanstack-react';
import LNB from './index';

// useStore(zustand)는 프로바이더 불필요. 라우터 컨텍스트는 프레임워크가 제공.
const meta = {
  title: 'Layout/LeftNav',
  component: LNB,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LNB>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
