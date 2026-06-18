import preview from '../../../.storybook/preview';
import Fieldset from './Fieldset';

const meta = preview.meta({
  title: 'Form/Fieldset',
  component: Fieldset,
  parameters: { layout: 'centered' },
  // 폼 안에서 쓰는 컴포넌트라 폭을 실제처럼 제한(grow=flex-1이 캔버스 전체를 채우는 것 방지).
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: {
    title: '이름',
    required: true,
    children: <input className="border rounded p-2" placeholder="입력" />,
  },
});

export const Required = meta.story();
export const Optional = meta.story({ args: { required: false } });
