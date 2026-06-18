import { useState } from 'react';
import preview from '../../../.storybook/preview';
import Button from './Button';
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

// ImageModal은 open prop 없이 마운트 시 자동 오픈한다(localStorage "다시 보지 않기" 존중).
// 그대로 렌더하면 오버레이가 docs 전체를 덮어 inline:false→컨트롤 미반영이 된다.
// 그래서 트리거 클릭 시점에 마운트(=자동 오픈)하고, key로 재마운트 + hidden 플래그를 지워
// 다시 열 수 있게 한다. docs는 play를 안 돌려 닫힌 트리거만 보인다.
const meta = preview.meta({
  title: 'UI/ImageModal',
  component: ImageModal,
  parameters: { layout: 'centered' },
  args: { id: 'sb-default', imageSrc: sampleImage },
  render: function Render(args) {
    const [seq, setSeq] = useState(0);
    return (
      <>
        <Button
          variant="secondary"
          onClick={() => {
            localStorage.removeItem(`image-modal-hidden-${args.id}`);
            setSeq((n) => n + 1);
          }}
        >
          이벤트 모달 열기
        </Button>
        {seq > 0 && <ImageModal key={seq} {...args} />}
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: '이벤트 모달 열기' }),
    );
  },
});

/** 닫기만 (외부 링크 없음). */
export const Default = meta.story();

/** 외부 링크 → "자세히 보기" 액션 버튼 노출. */
export const WithExternalLink = meta.story({
  args: { id: 'sb-link', externalLink: 'https://cse.snu.ac.kr' },
});
