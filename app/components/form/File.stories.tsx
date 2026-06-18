import preview from '../../../.storybook/preview';
import { withForm } from '../../../.storybook/withForm';
import File from './File';

const meta = preview.meta({
  title: 'Form/File',
  component: File,
  decorators: [withForm],
  // File은 value를 배열로 다룸([...files]) → 초기 빈 배열 필요(없으면 spread 크래시).
  parameters: { layout: 'centered', formValues: { attachment: [] } },
  args: { name: 'attachment' },
});

export const Single = meta.story();
export const Multiple = meta.story({ args: { multiple: true } });
