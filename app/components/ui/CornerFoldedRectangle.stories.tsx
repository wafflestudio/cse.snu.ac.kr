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
    // animationType은 optional(기본=무애니=undefined). Storybook은 undefined optional을 라디오에
    // 기본 선택으로 못 잡아(빈 라디오) → 컨트롤 숨기고 애니메이션은 아래 Folding 스토리로 보여준다.
    animationType: { control: false },
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

/** 펼침 애니메이션(SelectionList 펼쳐진 항목에서 사용). */
export const Folding = meta.story({
  args: { colorTheme: 'orange', children: card, animationType: 'folding' },
});
