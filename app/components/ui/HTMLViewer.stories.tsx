import { processHtmlForCsp } from '~/utils/processHtmlForCsp';
import preview from '../../../.storybook/preview';
import HTMLViewer from './HTMLViewer';

const meta = preview.meta({
  title: 'UI/HTMLViewer',
  component: HTMLViewer,
  parameters: { layout: 'padded' },
});

export const RichText = meta.story({
  args: {
    html: processHtmlForCsp(
      '<h2>제목</h2><p>본문 단락입니다. <strong>강조</strong>와 <a href="https://snu.ac.kr">링크</a>.</p><ul><li>항목 1</li><li>항목 2</li></ul>',
    ),
  },
});
