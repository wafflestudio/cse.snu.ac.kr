import type { Meta, StoryObj } from '@storybook/tanstack-react';
import ErrorState from './ErrorState';

const meta = {
  title: 'UI/ErrorState',
  component: ErrorState,
  parameters: { layout: 'fullscreen' },
  args: {
    title: '페이지를 찾을 수 없습니다',
    message: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
    action: { label: '홈으로', onClick: () => {} },
  },
} satisfies Meta<typeof ErrorState>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
