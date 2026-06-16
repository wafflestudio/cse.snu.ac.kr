import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { withForm } from '../../../.storybook/withForm';
import Text from './Text';

const meta = {
  title: 'Form/Text',
  component: Text,
  decorators: [withForm],
  parameters: { layout: 'centered' },
  args: { name: 'example', placeholder: '이름을 입력하세요' },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Centered: Story = { args: { textCenter: true } };
