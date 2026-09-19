import { createFileRoute } from '@tanstack/react-router';
import Content from './-content/layout.mdx';
import { mdxComponents } from './-mdx';

export const Route = createFileRoute('/design-system/layout')({
  component: () => <Content components={mdxComponents} />,
});
