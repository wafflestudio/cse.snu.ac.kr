import type { Meta, StoryObj } from '@storybook/tanstack-react';
import Node from './Nodes';

// 다이어그램 커넥터 프리미티브(연구 스트림·커리큘럼 등에서 사용).
// 실사용 변형만 노출한다. 커넥터라 보이려면 크기 있는 컨테이너가 필요해 데코레이터로 감싼다.
const meta = {
  title: 'UI/Nodes',
  component: Node,
  parameters: { layout: 'centered' },
  args: { variant: 'straight' },
  decorators: [
    (Story) => (
      <div className="flex h-24 w-64 items-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Node>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Straight: Story = {};
export const StraightDouble: Story = { args: { variant: 'straightDouble' } };
export const CurvedHorizontalGray: Story = {
  args: { variant: 'curvedHorizontalGray' },
};
export const CurvedHorizontalSmall: Story = {
  args: { variant: 'curvedHorizontalSmall' },
};
export const CurvedVertical: Story = { args: { variant: 'curvedVertical' } };
