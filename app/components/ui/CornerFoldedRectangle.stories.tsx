import type { Meta, StoryObj } from '@storybook/tanstack-react';
import CornerFoldedRectangle from './CornerFoldedRectangle';

const meta = {
  title: 'UI/CornerFoldedRectangle',
  component: CornerFoldedRectangle,
  parameters: { layout: 'centered' },
  args: {
    colorTheme: 'orange',
    size: 'large',
    children: <span className="p-4 block">접힌 모서리 카드</span>,
  },
} satisfies Meta<typeof CornerFoldedRectangle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Orange: Story = {};
export const Black: Story = { args: { colorTheme: 'black' } };
export const LightGray: Story = { args: { colorTheme: 'lightGray' } };
