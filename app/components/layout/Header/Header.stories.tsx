import type { Meta, StoryObj } from '@storybook/tanstack-react';
import Header from './index';

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Header>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
