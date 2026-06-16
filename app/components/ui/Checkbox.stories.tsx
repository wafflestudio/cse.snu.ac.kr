import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { useState } from 'react';
import Checkbox from './Checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  args: { label: '동의합니다', checked: false, onChange: () => {} },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { checked: true, disabled: true } };
export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
};
