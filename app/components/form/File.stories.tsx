import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { withForm } from '../../../.storybook/withForm';
import File from './File';

const meta = {
  title: 'Form/File',
  component: File,
  decorators: [withForm],
  // File은 value를 배열로 다룸([...files]) → 초기 빈 배열 필요(없으면 spread 크래시).
  parameters: { layout: 'centered', formValues: { attachment: [] } },
  args: { name: 'attachment' },
} satisfies Meta<typeof File>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};
export const Multiple: Story = { args: { multiple: true } };
