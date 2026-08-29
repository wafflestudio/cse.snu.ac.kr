import preview from '../../../.storybook/preview';
import { withForm } from '../../../.storybook/withForm';
import TextList from './TextList';

const meta = preview.meta({
  title: 'Form/TextList',
  component: TextList,
  decorators: [withForm],
  parameters: { layout: 'centered' },
  args: { name: 'keywords', placeholder: '항목 추가 후 Enter' },
});

export const Default = meta.story();
