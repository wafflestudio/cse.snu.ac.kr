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

// title prop은 Radix a11y용으로 VisuallyHidden 렌더라 화면엔 안 보인다(시각 variant 없음).
// 실제 사용처도 title을 안 넘겨 기본값('확인')만 쓴다 → 단일 스토리로 충분.
export const Default = meta.story();
