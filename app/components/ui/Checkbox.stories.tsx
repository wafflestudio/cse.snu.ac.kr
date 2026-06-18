import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { useArgs } from 'storybook/preview-api';
import Checkbox from './Checkbox';

// 제어 컴포넌트(checked/onChange)라 useArgs로 onChange→arg 갱신해야 클릭 체크가 먹는다.
// (disabled를 args에 명시해 'Set boolean' 버튼 없이 토글이 바로 뜨게 한다.)
const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  // onChange는 타입 충족용 noop(아래 render가 useArgs 갱신으로 덮어쓴다).
  args: {
    label: '동의합니다',
    checked: false,
    disabled: false,
    onChange: () => {},
  },
  render: function Render(args) {
    const [{ checked }, updateArgs] = useArgs();
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(v) => updateArgs({ checked: v })}
      />
    );
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { checked: true, disabled: true } };
