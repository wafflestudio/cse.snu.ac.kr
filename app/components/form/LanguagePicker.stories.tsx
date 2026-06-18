import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { useArgs } from 'storybook/preview-api';
import LanguagePicker, { type Language } from './LanguagePicker';

// 제어 컴포넌트(selected/onChange)라, onChange가 arg를 갱신해야 클릭이 반영된다.
// useArgs로 Controls 패널과 캔버스 클릭을 양방향 동기화(로컬 useState는 컨트롤을 죽임).
const meta = {
  title: 'Form/LanguagePicker',
  component: LanguagePicker,
  parameters: { layout: 'centered' },
  // onChange는 타입 충족용 noop(아래 render가 useArgs 갱신으로 덮어쓴다).
  args: { selected: 'ko', onChange: () => {} },
  render: function Render(args) {
    const [{ selected }, updateArgs] = useArgs();
    return (
      <LanguagePicker
        {...args}
        selected={selected as Language}
        onChange={(v) => updateArgs({ selected: v })}
      />
    );
  },
} satisfies Meta<typeof LanguagePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
