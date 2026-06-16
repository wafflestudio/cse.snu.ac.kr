import type { Meta, StoryObj } from '@storybook/tanstack-react';
import SearchBox from './index';

const meta = {
  title: 'Feature/SearchBox',
  component: SearchBox,
  parameters: { layout: 'padded' },
  args: { tags: ['학사(학부)', '장학', '수상', '행사'] },
} satisfies Meta<typeof SearchBox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const FormOnly: Story = { args: { formOnly: true } };
