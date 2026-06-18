import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { fn } from 'storybook/test';
import { Tag } from './Tag';

const meta = {
  title: 'UI/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
  args: { label: '학사(학부)' },
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = { args: { variant: 'outline' } };
export const Solid: Story = { args: { variant: 'solid' } };
export const Deletable: Story = { args: { onDelete: fn() } };
