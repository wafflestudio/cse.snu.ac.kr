import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { withForm } from '../../../.storybook/withForm';
import TextArea from './TextArea';

const meta = {
  title: 'Form/TextArea',
  component: TextArea,
  decorators: [withForm],
  parameters: { layout: 'centered' },
  args: { name: 'memo', placeholder: '내용을 입력하세요' },
} satisfies Meta<typeof TextArea>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
