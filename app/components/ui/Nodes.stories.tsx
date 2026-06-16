import type { Meta, StoryObj } from '@storybook/tanstack-react';
import Node from './Nodes';

// 다이어그램 커넥터 프리미티브(연구 스트림 등에서 사용).
const meta = {
  title: 'UI/Nodes',
  component: Node,
  parameters: { layout: 'centered' },
  args: { variant: 'straight', tone: 'brand' },
} satisfies Meta<typeof Node>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Straight: Story = {};
export const CurvedHorizontal: Story = {
  args: { variant: 'curvedHorizontal' },
};
export const Neutral: Story = { args: { tone: 'neutral' } };
