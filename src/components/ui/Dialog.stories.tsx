import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview';
import Button from './Button';
import Dialog from './Dialog';

// 모달은 open을 강제하지 않는다(트리거+play + open useArgs 패턴 — AlertDialog 참고). docs는
// 닫힌 트리거만 보여 오버레이가 페이지를 안 덮고 컨트롤이 라이브로 먹는다(open 컨트롤 포함).
// `title` prop은 VisuallyHidden(접근성용)이라 화면 제목은 children 안에 둔다(실사용 패턴).
const meta = preview.meta({
  title: 'UI/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  args: {
    open: false,
    title: '대화상자 제목',
    onOpenChange: fn(),
    children: (
      <div className="flex w-[26rem] max-w-full flex-col gap-3">
        <h2 className="text-xl font-semibold text-neutral-900">
          대화상자 제목
        </h2>
        <p className="text-md leading-6 text-neutral-700">
          대화상자 본문 내용입니다. 실제로는 폼·표·안내문 등 다양한 콘텐츠가
          들어갑니다.
        </p>
      </div>
    ),
  },
  render: function Render(args) {
    const [{ open }, updateArgs] = useArgs();
    return (
      <>
        <Button variant="secondary" onClick={() => updateArgs({ open: true })}>
          대화상자 열기
        </Button>
        <Dialog
          {...args}
          open={open}
          onOpenChange={(o) => updateArgs({ open: o })}
        />
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: '대화상자 열기' }),
    );
  },
});

export const Default = meta.story();
