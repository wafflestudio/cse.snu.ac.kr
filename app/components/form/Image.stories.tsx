import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { withForm } from '../../../.storybook/withForm';
import Image from './Image';

const meta = {
  title: 'Form/Image',
  component: Image,
  decorators: [withForm],
  parameters: { layout: 'centered' },
  args: { name: 'photo' },
} satisfies Meta<typeof Image>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
