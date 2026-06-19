import preview from '../../../.storybook/preview';
import Image from './Image';

// 예시 이미지는 placehold.co로 통일. `.svg` 포맷이라 shouldOptimize가 false →
// `/img` 프록시(SB엔 없음)를 안 타고 raw <img>로 로드된다(.png였다면 /img→404→폴백).
const sample = 'https://placehold.co/320x240/FB4E03/FFFFFF.svg';

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
