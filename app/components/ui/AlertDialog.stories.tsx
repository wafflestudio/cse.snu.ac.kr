import type { Meta, StoryObj } from '@storybook/tanstack-react';
import AlertDialog from './AlertDialog';

const meta = {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  parameters: { layout: 'centered' },
  args: {
    open: true,
    description: '정말 삭제하시겠습니까?',
    confirmText: '삭제',
    onConfirm: () => {},
    onOpenChange: () => {},
  },
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithTitle: Story = { args: { title: '삭제 확인' } };
