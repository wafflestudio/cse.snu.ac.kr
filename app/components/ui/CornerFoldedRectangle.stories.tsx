import preview from '../../../.storybook/preview';
import CornerFoldedRectangle from './CornerFoldedRectangle';

const meta = preview.meta({
  title: 'UI/CornerFoldedRectangle',
  component: CornerFoldedRectangle,
  parameters: { layout: 'centered' },
  args: { size: 'large' },
});

// 필수 prop인 children(ReactNode)·colorTheme(union)은 CSF4가 meta.args만으론
// "충족"으로 인식 못 해 각 스토리에 명시해야 한다(공통 children은 상수로 공유).
const card = <span className="p-4 block">접힌 모서리 카드</span>;

export const Orange = meta.story({
  args: { colorTheme: 'orange', children: card },
});
export const Black = meta.story({
  args: { colorTheme: 'black', children: card },
});
export const LightGray = meta.story({
  args: { colorTheme: 'lightGray', children: card },
});
