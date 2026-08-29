import { useArgs } from 'storybook/preview-api';
import preview from '../../../.storybook/preview';
import LanguagePicker, { type Language } from './LanguagePicker';

// 제어 컴포넌트(selected/onChange)라, onChange가 arg를 갱신해야 클릭이 반영된다.
// useArgs로 Controls 패널과 캔버스 클릭을 양방향 동기화(로컬 useState는 컨트롤을 죽임).
const meta = preview.meta({
  title: 'Form/LanguagePicker',
  component: LanguagePicker,
  parameters: { layout: 'centered' },
  // onChange는 타입 충족용 noop(아래 render가 useArgs 갱신으로 덮어쓴다).
  args: { selected: 'ko', onChange: () => {} },
  render: function Render(args) {
    const [{ selected }, updateArgs] = useArgs();
    return (
      <LanguagePicker
        {...args}
        selected={selected as Language}
        onChange={(v) => updateArgs({ selected: v })}
      />
    );
  },
});

// selected(union)·onChange는 필수라 CSF4가 meta.args만으론 충족 인식 못 해 스토리에 명시
// (실제 동작은 meta의 useArgs render가 담당).
export const Default = meta.story({
  args: { selected: 'ko', onChange: () => {} },
});
