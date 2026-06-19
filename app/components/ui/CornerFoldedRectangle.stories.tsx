import preview from '../../../.storybook/preview';
import CornerFoldedRectangle from './CornerFoldedRectangle';

const card = <span className="p-4 block">접힌 모서리 카드</span>;

const meta = preview.meta({
  title: 'UI/CornerFoldedRectangle',
  component: CornerFoldedRectangle,
  parameters: { layout: 'centered' },
  // Docs 컨트롤이 비지 않도록 컴포넌트 기본값을 명시한다.
  args: {
    colorTheme: 'orange',
    size: 'large',
    shadow: 'medium',
    width: 'w-fit',
    children: card,
  },
  argTypes: {
    // animationType은 optional(기본=애니메이션 없음) → none을 기본 선택지로 노출(undefined 매핑).
    animationType: {
      control: 'inline-radio',
      options: ['none', 'folding', 'unfolding'],
      mapping: { none: undefined, folding: 'folding', unfolding: 'unfolding' },
    },
  },
});

// colorTheme(union)·children은 CSF4가 meta.args만으론 충족 인식 못 해 스토리에 명시.
export const Orange = meta.story({
  args: { colorTheme: 'orange', children: card },
});
export const Black = meta.story({
  args: { colorTheme: 'black', children: card },
});
export const LightGray = meta.story({
  args: { colorTheme: 'lightGray', children: card },
});
