import preview from '../../../.storybook/preview';
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

const meta = preview.meta({
  title: 'UI/ImageModal',
  component: ImageModal,
  parameters: {
    layout: 'fullscreen',
    // 마운트 시 자동 오픈 → portal 오버레이가 docs 페이지 전체를 덮는다 → 독립 iframe 격리.
    // 세로 포스터(320×400)가 잘려 이미지 컨테이너(overflow-auto)에 스크롤바가 생기지 않도록
    // 90vh 기준 이미지가 다 들어갈 높이를 준다.
    docs: { story: { inline: false, iframeHeight: '760px' } },
  },
  args: { id: 'sb-default', imageSrc: sampleImage },
});

/** 닫기만 (외부 링크 없음). */
export const Default = meta.story();

/** 외부 링크 → "자세히 보기" 액션 버튼 노출. */
export const WithExternalLink = meta.story({
  args: { id: 'sb-link', externalLink: 'https://cse.snu.ac.kr' },
});
