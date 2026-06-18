import preview from '../../../.storybook/preview';
import { withForm } from '../../../.storybook/withForm';
import Radio from './Radio';

// 라디오는 같은 name을 공유하는 여러 옵션으로 쓰는 게 실사용(단일 선택 그룹).
const meta = preview.meta({
  title: 'Form/Radio',
  component: Radio,
  decorators: [withForm],
  parameters: {
    layout: 'centered',
    formValues: { grade: '학사' }, // '학사' 선택된 상태
  },
  args: { name: 'grade', value: '학사', label: '학사과정' },
});

export const Group = meta.story({
  render: () => (
    <div className="flex flex-col gap-2">
      <Radio name="grade" value="학사" label="학사과정" />
      <Radio name="grade" value="석사" label="석사과정" />
      <Radio name="grade" value="박사" label="박사과정" />
    </div>
  ),
});
