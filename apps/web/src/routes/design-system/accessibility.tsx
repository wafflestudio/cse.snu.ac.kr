import { createFileRoute } from '@tanstack/react-router';
import Content from './-content/accessibility.mdx';
import { mdxComponents } from './-mdx';

export const Route = createFileRoute('/design-system/accessibility')({
  component: () => <Content components={mdxComponents} />,
});
