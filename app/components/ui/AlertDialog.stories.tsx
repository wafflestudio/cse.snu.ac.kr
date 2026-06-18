import { useState } from 'react';
import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview';
import AlertDialog from './AlertDialog';
import Button from './Button';

// 모달은 open을 강제하지 않는다 — 열어두면 portal 오버레이가 docs 전체를 덮어 inline:false가
// 강요되고, 그러면 Docs 컨트롤이 라이브로 안 먹는다. 대신 트리거+상태로 닫힌 채 렌더하고,
// canvas에선 play가 열어 보여준다(docs는 play를 안 돌려 닫힌 트리거만 → 컨트롤 정상 반영).
const meta = preview.meta({
  title: 'UI/AlertDialog',
  component: AlertDialog,
  parameters: { layout: 'centered' },
  args: {
    open: false,
    description: '정말 삭제하시겠습니까?',
    confirmText: '삭제',
    onConfirm: fn(),
    onOpenChange: fn(),
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button kind="secondary" onClick={() => setOpen(true)}>
          항목 삭제
        </Button>
        <AlertDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '항목 삭제' }));
  },
});

// title prop은 Radix a11y용으로 VisuallyHidden 렌더라 화면엔 안 보인다(시각 variant 없음).
// 실제 사용처도 title을 안 넘겨 기본값('확인')만 쓴다 → 단일 스토리로 충분.
export const Default = meta.story();
