import preview from '../../../.storybook/preview';
import { withForm } from '../../../.storybook/withForm';
import Text from './Text';

const meta = preview.meta({
  title: 'Form/Text',
  component: Text,
  decorators: [withForm],
  parameters: { layout: 'centered' },
  args: { name: 'example', placeholder: '이름을 입력하세요' },
});

export const Default = meta.story();
export const Centered = meta.story({ args: { textCenter: true } });
