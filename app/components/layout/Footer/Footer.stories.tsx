import preview from '../../../../.storybook/preview';
import Footer from './index';

// 레이아웃 컴포넌트(무 props). @storybook/tanstack-react가 라우터 컨텍스트 제공 → Link 동작.
const meta = preview.meta({
  title: 'Layout/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
});

export const Default = meta.story();
