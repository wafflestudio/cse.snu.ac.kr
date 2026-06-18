import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview';
import { Tag } from './Tag';

const meta = preview.meta({
  title: 'UI/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
  args: { label: '학사(학부)' },
});

export const Outline = meta.story({ args: { variant: 'outline' } });
export const Solid = meta.story({ args: { variant: 'solid' } });
export const Deletable = meta.story({ args: { onDelete: fn() } });
