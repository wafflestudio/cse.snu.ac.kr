import preview from '../../../.storybook/preview';
import Attachments from './Attachments';

const meta = preview.meta({
  title: 'UI/Attachments',
  component: Attachments,
  parameters: { layout: 'padded' },
  args: {
    files: [
      { id: 1, name: '2024-신입생-안내.pdf', bytes: 1048576, url: '#' },
      { id: 2, name: '장학금-신청서.hwp', bytes: 51200, url: '#' },
    ],
  },
});

export const Default = meta.story();
