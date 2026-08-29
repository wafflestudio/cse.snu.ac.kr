import preview from '../../../.storybook/preview';
import { withForm } from '../../../.storybook/withForm';
import Checkbox from './Checkbox';

// 체크박스는 같은 name을 공유하는 여러 옵션(다중 선택, value 배열)으로 쓰는 게 실사용(태그 필터 등).
const meta = preview.meta({
  title: 'Form/Checkbox',
  component: Checkbox,
  decorators: [withForm],
  parameters: {
    layout: 'centered',
    formValues: { tags: ['ai'] }, // '인공지능' 체크된 상태
  },
  args: { name: 'tags', value: 'ai', label: '인공지능' },
});

export const Group = meta.story({
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox name="tags" value="ai" label="인공지능" />
      <Checkbox name="tags" value="system" label="시스템·네트워크" />
      <Checkbox name="tags" value="theory" label="이론" />
    </div>
  ),
});

/** 단일 동의 체크박스(boolean) 용례. */
export const Single = meta.story({
  decorators: [withForm],
  parameters: { formValues: { agree: false } },
  render: () => <Checkbox name="agree" value="yes" label="약관에 동의합니다" />,
});
