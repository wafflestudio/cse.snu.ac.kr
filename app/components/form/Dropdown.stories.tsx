import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { withForm } from '../../../.storybook/withForm';
import Dropdown from './Dropdown';

const meta = {
  title: 'Form/Dropdown',
  component: Dropdown,
  decorators: [withForm],
  // 선택값 없으면 버튼에 라벨이 안 떠 빈 상태로 보임 → 초기 선택값 지정.
  parameters: { layout: 'centered', formValues: { category: 'undergraduate' } },
  args: {
    name: 'category',
    contents: [
      { label: '학사', value: 'undergraduate' },
      { label: '대학원', value: 'graduate' },
      { label: '전체', value: 'all' },
    ],
  },
} satisfies Meta<typeof Dropdown>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
