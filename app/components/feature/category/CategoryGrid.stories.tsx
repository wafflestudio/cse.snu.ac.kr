import { navigationTree } from '~/constants/navigation';
import preview from '../../../../.storybook/preview';
import CategoryGrid from './CategoryGrid';

// 라우터 컨텍스트는 프레임워크가 제공(useNavigate/useLanguage).
const aboutPage = navigationTree.find((item) => item.key === '소개') ?? null;

const meta = preview.meta({
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
});

// 필수 prop(currentPage·theme=union)은 CSF4가 meta.args만으론 충족 인식 못 해 스토리에 명시.
export const Light = meta.story({
  args: { currentPage: aboutPage, theme: 'light' },
});
export const Dark = meta.story({
  args: { currentPage: aboutPage, theme: 'dark' },
});
