import preview from '../../../../.storybook/preview';
import SelectionList from './SelectionList';

const meta = preview.meta({
  title: 'Feature/SelectionList',
  component: SelectionList,
  parameters: { layout: 'padded' },
  args: {
    items: [
      { id: '1', label: '학부 소개', href: '/about/overview', selected: true },
      { id: '2', label: '교수진', href: '/people/faculty' },
      { id: '3', label: '학부 안내', href: '/academics/undergraduate/guide' },
      { id: '4', label: '대학원 안내', href: '/academics/graduate/guide' },
    ],
  },
});

export const Default = meta.story();
