import type { Meta, StoryObj } from '@storybook/tanstack-react';
import AlertDialog from './AlertDialog';

const meta = {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  parameters: {
    // 모달은 풀블리드(portal fixed inset-0) → fullscreen으로 통일(ImageModal/Dialog와 동일).
    layout: 'fullscreen',
    // open된 모달은 오버레이가 docs 페이지 전체를 덮는다 → 독립 iframe 격리.
    docs: { story: { inline: false, iframeHeight: 360 } },
  },
  args: {
    open: true,
    description: '정말 삭제하시겠습니까?',
    confirmText: '삭제',
    onConfirm: () => {},
    onOpenChange: () => {},
  },
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithTitle: Story = { args: { title: '삭제 확인' } };
