import preview from '../../../.storybook/preview';
import { withForm } from '../../../.storybook/withForm';
import DatePicker from './DatePicker';

const meta = preview.meta({
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
  // inline:false 대신 닫힌 채 렌더 → canvas에선 play가 열어 캘린더를 보여준다(docs는 트리거만).
  parameters: {
    layout: 'centered',
    formValues: { date: new Date('2024-03-15T09:00:00') },
  },
  args: { name: 'date' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button'));
  },
});

export const Default = meta.story();
export const DateOnly = meta.story({ args: { hideTime: true } });
