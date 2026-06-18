import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { withForm } from '../../../.storybook/withForm';
import Dropdown from './Dropdown';

const meta = {
  title: 'Form/Dropdown',
  component: Dropdown,
  // 펼치면 아래로 늘어나므로 세로 여유를 주는 래퍼를 바깥에, withForm을 안쪽에.
  decorators: [
    (Story) => (
      <div className="pt-8 pb-60">
        <Story />
      </div>
    ),
    withForm,
  ],
  // 선택값 없으면 버튼에 라벨이 안 떠 빈 상태로 보임 → 초기 선택값 지정.
  parameters: {
    layout: 'fullscreen',
    formValues: { category: 'undergraduate' },
    docs: { story: { inline: false, iframeHeight: 320 } },
  },
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
