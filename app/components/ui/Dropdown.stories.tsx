import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { useState } from 'react';
import Dropdown from './Dropdown';

const meta = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  args: {
    contents: ['전체', '학사', '대학원', '장학'],
    selectedIndex: 0,
    onClick: () => {},
  },
} satisfies Meta<typeof Dropdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [index, setIndex] = useState(0);
    return <Dropdown {...args} selectedIndex={index} onClick={setIndex} />;
  },
};
