import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { fn } from 'storybook/test';
import { withForm } from '../../../.storybook/withForm';
import Action from './Action';

const meta = {
  title: 'Form/Action',
  component: Action,
  decorators: [withForm],
  parameters: { layout: 'centered' },
  args: {
    onCancel: fn(),
    onSubmit: fn(),
    submitLabel: '저장하기',
  },
  argTypes: {
    submitLabel: {
      control: 'text',
      description: '저장 버튼 라벨(기본 "저장하기").',
    },
  },
} satisfies Meta<typeof Action>;
export default meta;
type Story = StoryObj<typeof meta>;

/** 취소 + 저장 (생성/단순 편집 폼). */
export const Default: Story = {};

/** 삭제 버튼 포함 (기존 항목 편집 폼). */
export const WithDelete: Story = {
  args: { onDelete: fn() },
};

export const CustomLabel: Story = {
  args: { submitLabel: '추가하기' },
};
