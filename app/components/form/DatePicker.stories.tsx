import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { withForm } from '../../../.storybook/withForm';
import DatePicker from './DatePicker';

const meta = {
  title: 'Form/DatePicker',
  component: DatePicker,
  // 캘린더가 아래로 펼쳐지므로 세로 여유를 주는 래퍼를 바깥에, withForm을 안쪽에.
  decorators: [
    (Story) => (
      <div className="pt-8 pb-80">
        <Story />
      </div>
    ),
    withForm,
  ],
  // DatePicker는 value를 Date로 다룸 → 초기 Date 필요(없으면 getHours 크래시).
  parameters: {
    layout: 'fullscreen',
    formValues: { date: new Date('2024-03-15T09:00:00') },
    docs: { story: { inline: false, iframeHeight: 440 } },
  },
  args: { name: 'date' },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DateOnly: Story = { args: { hideTime: true } };
