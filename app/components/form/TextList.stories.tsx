import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { withForm } from '../../../.storybook/withForm';
import TextList from './TextList';

const meta = {
  title: 'Form/TextList',
  component: TextList,
  decorators: [withForm],
  parameters: { layout: 'centered' },
  args: { name: 'keywords', placeholder: '항목 추가 후 Enter' },
} satisfies Meta<typeof TextList>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
