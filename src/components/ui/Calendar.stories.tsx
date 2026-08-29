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
    // disabled는 DayPicker Matcher(함수 포함 복합 타입)라 컨트롤로 편집 불가 →
    // 컨트롤은 숨기고(스토리는 디자인 확인용), 비활성 디자인은 아래 DisabledPast 스토리로 보여준다.
    disabled: { control: false },
  },
  args: { selected: new Date('2026-06-15'), onSelect: () => {} },
  // selected를 useArgs로 묶어 컨트롤·날짜 클릭이 같은 arg를 움직인다(로컬 useState면 컨트롤이 무시됨).
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

export const Default = meta.story({});

/** 과거 비활성(DatePicker의 disablePast 용례) — 비활성 일자 디자인 확인용. */
export const DisabledPast = meta.story({
  args: { disabled: { before: new Date('2026-06-15') } },
});
