import { useArgs } from 'storybook/preview-api';
import preview from '../../../.storybook/preview';
import Dropdown from './Dropdown';

// 제어 컴포넌트라 useArgs로 onClick→selectedIndex arg 갱신(컨트롤·클릭 동기화).
const meta = preview.meta({
  title: 'UI/Dropdown',
  component: Dropdown,
  // inline:false 대신 닫힌 채 렌더 → canvas에선 play가 열어 펼침을 보여준다(docs는 트리거만).
  parameters: { layout: 'fullscreen' },
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
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox'));
  },
});

export const Default = meta.story();
