import { createFileRoute } from '@tanstack/react-router';
import Content from './-content/typography.mdx';
import { mdxComponents } from './-mdx';

export const Route = createFileRoute('/design-system/typography')({
  component: () => <Content components={mdxComponents} />,
});
