import type { Preview } from '@storybook/tanstack-react';
// 앱 전역 스타일(Tailwind v4 엔트리 + 토스트). 없으면 SB에 스타일이 전혀 안 입혀진다.
import '../app/app.css';
import '../app/components/ui/sonner/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  // 컴포넌트별 자동 문서 페이지 생성(props 표 + 스토리 미리보기).
  tags: ['autodocs'],
};

export default preview;
