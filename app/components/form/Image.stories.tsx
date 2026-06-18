import preview from '../../../.storybook/preview';
import { withForm } from '../../../.storybook/withForm';
import Image from './Image';

const meta = preview.meta({
  title: 'Form/Image',
  component: Image,
  decorators: [withForm],
  parameters: { layout: 'centered' },
  args: { name: 'photo' },
});

export const Default = meta.story();
