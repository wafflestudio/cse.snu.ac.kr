import preview from '../../../.storybook/preview';
import Section from './Section';

const meta = preview.meta({
  title: 'Form/Section',
  component: Section,
  parameters: { layout: 'padded' },
  args: {
    title: '기본 정보',
    children: <p className="text-md text-neutral-600">섹션 본문 콘텐츠</p>,
  },
});

export const Default = meta.story();
