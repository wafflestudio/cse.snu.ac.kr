import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { navigationTree } from '~/constants/navigation';
import CategoryGrid from './CategoryGrid';

// 라우터 컨텍스트는 프레임워크가 제공(useNavigate/useLanguage).
const aboutPage = navigationTree.find((item) => item.key === '소개') ?? null;

const meta = {
  title: 'Feature/CategoryGrid',
  component: CategoryGrid,
  parameters: { layout: 'fullscreen' },
  args: { currentPage: aboutPage, theme: 'light' },
  argTypes: {
    theme: {
      control: 'inline-radio',
      options: ['light', 'dark'],
      description: '배경 테마.',
    },
  },
} satisfies Meta<typeof CategoryGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};
export const Dark: Story = {
  args: { theme: 'dark' },
  parameters: { backgrounds: { default: 'dark' } },
};
