import type { Meta, StoryObj } from '@storybook/tanstack-react';
import Pagination from './Pagination';

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  args: { page: 3, totalPages: 12 },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Middle: Story = {};
export const FirstPage: Story = { args: { page: 1 } };
export const FewPages: Story = { args: { page: 1, totalPages: 3 } };
