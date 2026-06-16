import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { withForm } from '../../../.storybook/withForm';
import DatePicker from './DatePicker';

const meta = {
  title: 'Form/DatePicker',
  component: DatePicker,
  decorators: [withForm],
  // DatePicker는 value를 Date로 다룸 → 초기 Date 필요(없으면 getHours 크래시).
  parameters: {
    layout: 'centered',
    formValues: { date: new Date('2024-03-15T09:00:00') },
  },
  args: { name: 'date' },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DateOnly: Story = { args: { hideTime: true } };
