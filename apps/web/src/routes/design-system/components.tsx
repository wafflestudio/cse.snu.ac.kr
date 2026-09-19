import { createFileRoute } from '@tanstack/react-router';
import Content from './-content/components.mdx';
import { mdxComponents } from './-mdx';

export const Route = createFileRoute('/design-system/components')({
  component: () => <Content components={mdxComponents} />,
});
