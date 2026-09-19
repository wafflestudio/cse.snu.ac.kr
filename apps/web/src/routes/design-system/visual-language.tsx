import { createFileRoute } from '@tanstack/react-router';
import Content from './-content/visual-language.mdx';
import { mdxComponents } from './-mdx';

export const Route = createFileRoute('/design-system/visual-language')({
  component: () => <Content components={mdxComponents} />,
});
