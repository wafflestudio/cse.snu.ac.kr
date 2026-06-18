import type { Meta, StoryObj } from '@storybook/tanstack-react';
import Dialog from './Dialog';

// `title` prop은 VisuallyHidden(접근성용)이라 화면 제목은 children 안에 둔다(실사용 패턴).
// children 폭이 좁으면 우상단 X(absolute)와 겹치므로 실제처럼 충분한 콘텐츠를 준다.
const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    // 모달은 풀블리드(portal fixed inset-0) → fullscreen으로 통일(ImageModal/AlertDialog와 동일).
    layout: 'fullscreen',
    // open된 모달은 오버레이가 docs 페이지 전체를 덮는다 → 독립 iframe 격리.
    docs: { story: { inline: false, iframeHeight: 480 } },
  },
  args: {
    open: true,
    title: '대화상자 제목',
    onOpenChange: () => {},
    children: (
      <div className="flex w-[26rem] max-w-full flex-col gap-3">
        <h2 className="text-xl font-semibold text-neutral-900">
          대화상자 제목
        </h2>
        <p className="text-md leading-6 text-neutral-700">
          대화상자 본문 내용입니다. 실제로는 폼·표·안내문 등 더 넓은 콘텐츠가
          들어가며, 우상단 닫기(X) 버튼과 겹치지 않습니다.
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof Dialog>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
