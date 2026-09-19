import { createFileRoute } from '@tanstack/react-router';
import Content from './-content/writing.mdx';
import { mdxComponents } from './-mdx';

export const Route = createFileRoute('/design-system/writing')({
  component: () => <Content components={mdxComponents} />,
});
