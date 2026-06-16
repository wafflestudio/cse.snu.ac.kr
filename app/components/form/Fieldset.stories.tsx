import type { Meta, StoryObj } from '@storybook/tanstack-react';
import Fieldset from './Fieldset';

const meta = {
  title: 'Form/Fieldset',
  component: Fieldset,
  parameters: { layout: 'padded' },
  args: {
    title: '이름',
    required: true,
    children: <input className="border rounded p-2" placeholder="입력" />,
  },
} satisfies Meta<typeof Fieldset>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = {};
export const Optional: Story = { args: { required: false } };
