import type { Meta, StoryObj } from '@storybook/tanstack-react';
import ImageModal from './ImageModal';

// 메인 페이지 이벤트 안내 모달(마운트 시 자동 오픈, "다시 보지 않기"=localStorage).
// 결정론을 위해 원격 이미지 대신 인라인 data-URI SVG 사용.
const sampleImage =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400">
      <rect width="320" height="400" fill="#FB4E03"/>
      <text x="160" y="200" fill="white" font-size="28" font-family="sans-serif"
        text-anchor="middle">이벤트 안내</text>
    </svg>`,
  );

const meta = {
  title: 'UI/ImageModal',
  component: ImageModal,
  parameters: { layout: 'fullscreen' },
  args: { id: 'sb-default', imageSrc: sampleImage },
} satisfies Meta<typeof ImageModal>;
export default meta;
type Story = StoryObj<typeof meta>;

/** 닫기만 (외부 링크 없음). */
export const Default: Story = {};

/** 외부 링크 → "자세히 보기" 액션 버튼 노출. */
export const WithExternalLink: Story = {
  args: { id: 'sb-link', externalLink: 'https://cse.snu.ac.kr' },
};
