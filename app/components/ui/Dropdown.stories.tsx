import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { useArgs } from 'storybook/preview-api';
import Dropdown from './Dropdown';

// 제어 컴포넌트라 useArgs로 onClick→selectedIndex arg 갱신(컨트롤·클릭 동기화).
const meta = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'fullscreen',
    // 펼치면 아래로 ~168px 늘어나므로 프리뷰(특히 docs)에 세로 여유를 준다.
    docs: { story: { inline: false, iframeHeight: 320 } },
  },
  decorators: [
    (Story) => (
      <div className="flex justify-center px-10 pt-8 pb-60">
        <Story />
      </div>
    ),
  ],
  // onClick은 타입 충족용 noop(아래 render가 useArgs 갱신으로 덮어쓴다).
  args: {
    contents: ['전체', '학사', '대학원', '장학'],
    selectedIndex: 0,
    onClick: () => {},
  },
  render: function Render(args) {
    const [{ selectedIndex }, updateArgs] = useArgs();
    return (
      <Dropdown
        {...args}
        selectedIndex={selectedIndex}
        onClick={(i) => updateArgs({ selectedIndex: i })}
      />
    );
  },
} satisfies Meta<typeof Dropdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
