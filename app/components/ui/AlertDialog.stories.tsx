import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview';
import AlertDialog from './AlertDialog';

const meta = preview.meta({
  title: 'UI/AlertDialog',
  component: AlertDialog,
  parameters: {
    // 모달은 풀블리드(portal fixed inset-0) → fullscreen으로 통일(ImageModal/Dialog와 동일).
    layout: 'fullscreen',
    // open된 모달은 오버레이가 docs 페이지 전체를 덮는다 → 독립 iframe 격리.
    docs: { story: { inline: false, iframeHeight: '360px' } },
  },
  args: {
    open: true,
    description: '정말 삭제하시겠습니까?',
    confirmText: '삭제',
    onConfirm: fn(),
    onOpenChange: fn(),
  },
});

export const Default = meta.story();
export const WithTitle = meta.story({ args: { title: '삭제 확인' } });
