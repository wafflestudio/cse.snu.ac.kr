import preview from '../../../.storybook/preview';
import { withForm } from '../../../.storybook/withForm';
import TextArea from './TextArea';

const meta = preview.meta({
  title: 'Form/TextArea',
  component: TextArea,
  decorators: [withForm],
  parameters: { layout: 'centered' },
  args: { name: 'memo', placeholder: '내용을 입력하세요' },
});

export const Default = meta.story();
