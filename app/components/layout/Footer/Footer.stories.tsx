import type { Meta, StoryObj } from '@storybook/tanstack-react';
import Footer from './index';

// 레이아웃 컴포넌트(무 props). @storybook/tanstack-react가 라우터 컨텍스트 제공 → Link 동작.
const meta = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
