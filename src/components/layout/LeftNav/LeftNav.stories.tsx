import preview from '../../../../.storybook/preview';
import LNB from './index';

// useStore(zustand)는 프로바이더 불필요. 라우터 컨텍스트는 프레임워크가 제공.
const meta = preview.meta({
  title: 'Layout/LeftNav',
  component: LNB,
  parameters: {
    layout: 'fullscreen',
    // position:fixed라 autodocs 인라인 블록 밖으로 빠져 안 보인다 → 독립 iframe으로 렌더.
    docs: { story: { inline: false, iframeHeight: '900px' } },
  },
});

export const Default = meta.story();
