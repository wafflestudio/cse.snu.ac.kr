import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview';
import { withForm } from '../../../.storybook/withForm';
import Action from './Action';

const meta = preview.meta({
  title: 'Form/Action',
  component: Action,
  decorators: [withForm],
  parameters: { layout: 'centered' },
  args: {
    onCancel: fn(),
    onSubmit: fn(),
    submitLabel: '저장하기',
  },
  argTypes: {
    submitLabel: {
      control: 'text',
      description: '저장 버튼 라벨(기본 "저장하기").',
    },
  },
});

/** 취소 + 저장 (생성/단순 편집 폼). */
export const Default = meta.story();

/** 삭제 버튼 포함 (기존 항목 편집 폼). */
export const WithDelete = meta.story({
  args: { onDelete: fn() },
});

export const CustomLabel = meta.story({
  args: { submitLabel: '추가하기' },
});
