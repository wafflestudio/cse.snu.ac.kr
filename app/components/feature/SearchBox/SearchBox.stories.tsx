import preview from '../../../../.storybook/preview';
import SearchBox from './index';

const meta = preview.meta({
  title: 'Feature/SearchBox',
  component: SearchBox,
  parameters: { layout: 'padded' },
  args: { tags: ['학사(학부)', '장학', '수상', '행사'] },
});

export const Default = meta.story();
export const Disabled = meta.story({ args: { disabled: true } });
export const FormOnly = meta.story({ args: { formOnly: true } });
