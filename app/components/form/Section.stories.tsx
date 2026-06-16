import type { Meta, StoryObj } from '@storybook/tanstack-react';
import Section from './Section';

const meta = {
  title: 'Form/Section',
  component: Section,
  parameters: { layout: 'padded' },
  args: {
    title: '기본 정보',
    children: <p className="text-md text-neutral-600">섹션 본문 콘텐츠</p>,
  },
} satisfies Meta<typeof Section>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
