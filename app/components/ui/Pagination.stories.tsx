import preview from '../../../.storybook/preview';
import Pagination from './Pagination';

const meta = preview.meta({
  title: 'UI/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  args: { page: 3, totalPages: 12 },
});

export const Middle = meta.story();
export const FirstPage = meta.story({ args: { page: 1 } });
export const FewPages = meta.story({ args: { page: 1, totalPages: 3 } });
