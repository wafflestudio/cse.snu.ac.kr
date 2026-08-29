import preview from '../../../../.storybook/preview';
import Header from './index';

const meta = preview.meta({
  title: 'Layout/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  // Header는 prod에서 bg-neutral-900(PageLayout) 위에 흰 로고/네비로 얹힌다.
  // SB 흰 캔버스에선 흰 요소가 묻히므로 실제 배경을 깔아준다.
  decorators: [
    (Story) => (
      <div className="bg-neutral-900">
        <Story />
      </div>
    ),
  ],
});

export const Default = meta.story();
