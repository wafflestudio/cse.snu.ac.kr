import { useArgs } from 'storybook/preview-api';
import preview from '../../../.storybook/preview';
import Calendar from './Calendar';

const meta = preview.meta({
  title: 'UI/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
  argTypes: {
    // selected: 이름이 *Date가 아니라 date 매처에 안 걸려 명시(date 컨트롤 값은 timestamp).
    selected: { control: 'date' },
    // disabled는 DayPicker Matcher(복합 타입)라 boolean이 아님 → 의미 있는 예시만 매핑으로 노출.
    disabled: {
      control: 'inline-radio',
      options: ['none', 'past'],
      mapping: { none: undefined, past: { before: new Date('2026-06-15') } },
      description: 'past=6/15 이전 비활성(실제론 DayPicker Matcher).',
    },
  },
  args: { selected: new Date('2026-06-15'), onSelect: () => {} },
});

// selected를 useArgs로 묶어 컨트롤·날짜 클릭이 같은 arg를 움직인다(로컬 useState면 컨트롤이 무시됨).
// 참고: Calendar는 selected의 '월'로 뷰를 이동하진 않으므로(month prop 미노출), 보이는 달 안의
// 날짜 변경은 즉시 반영되지만 다른 달로 바꾸면 강조가 현재 달 화면엔 안 보일 수 있다.
export const Default = meta.story({
  render: function Render(args) {
    const [{ selected }, updateArgs] = useArgs();
    return (
      <Calendar
        {...args}
        selected={new Date(selected as number | Date)}
        onSelect={(d) => updateArgs({ selected: d })}
      />
    );
  },
});
