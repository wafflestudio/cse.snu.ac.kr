import { useState } from 'react';
import preview from '../../../.storybook/preview';
import Calendar from './Calendar';

const meta = preview.meta({
  title: 'UI/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
  args: { selected: new Date('2026-06-15'), onSelect: () => {} },
});

export const Default = meta.story({
  render: (args) => {
    const [date, setDate] = useState(new Date('2026-06-15'));
    return <Calendar {...args} selected={date} onSelect={setDate} />;
  },
});
