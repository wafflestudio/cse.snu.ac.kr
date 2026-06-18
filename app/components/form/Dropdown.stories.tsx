import preview from '../../../.storybook/preview';
import { withForm } from '../../../.storybook/withForm';
import Dropdown from './Dropdown';

const meta = preview.meta({
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
  // inline:false 대신 닫힌 채 렌더 → canvas에선 play가 열어 펼침을 보여준다(docs는 트리거만).
  parameters: {
    layout: 'fullscreen',
    formValues: { category: 'undergraduate' },
  },
  args: {
    name: 'category',
    contents: [
      { label: '학사', value: 'undergraduate' },
      { label: '대학원', value: 'graduate' },
      { label: '전체', value: 'all' },
    ],
  },
  // 트리거는 첫 버튼(아래 옵션 버튼들은 상시 DOM에 있고 scale로 접힘).
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getAllByRole('button')[0]);
  },
});

export const Default = meta.story();
