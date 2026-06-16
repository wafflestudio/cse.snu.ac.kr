import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { useState } from 'react';
import Calendar from './Calendar';

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
  args: { selected: new Date('2026-06-15'), onSelect: () => {} },
} satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [date, setDate] = useState(new Date('2026-06-15'));
    return <Calendar {...args} selected={date} onSelect={setDate} />;
  },
};
