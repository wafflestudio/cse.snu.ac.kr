import preview from '../../../.storybook/preview';
import Image from './Image';

// Image는 http(s) src를 `/img?url=…`(최적화 프록시)로 감싸는데 Storybook엔 /img 서버가 없어
// 404→폴백이 된다. 그래서 예시는 최적화를 안 타는 data-URI(=상대 경로 취급)로 실제 이미지를 보여준다.
const sample =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FB4E03"/><stop offset="1" stop-color="#202020"/>
      </linearGradient></defs>
      <rect width="320" height="240" fill="url(#g)"/>
      <text x="160" y="128" fill="white" font-size="22" font-family="sans-serif"
        text-anchor="middle">예시 이미지 320×240</text>
    </svg>`,
  );

const meta = preview.meta({
  title: 'UI/Image',
  component: Image,
  parameters: { layout: 'centered' },
  args: { src: sample, width: 320, height: 240, alt: '예시 이미지' },
});

export const Default = meta.story();

/** src가 없거나 로드 실패 시 SNU 로고 플레이스홀더. */
export const Fallback = meta.story({
  name: 'src 없음(플레이스홀더)',
  args: { src: null, className: 'h-[240px] w-[320px]' },
});
