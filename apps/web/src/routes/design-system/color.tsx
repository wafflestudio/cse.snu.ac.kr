import { createFileRoute } from '@tanstack/react-router';
import Content from './-content/color.mdx';
import { mdxComponents } from './-mdx';

export const Route = createFileRoute('/design-system/color')({
  component: () => <Content components={mdxComponents} />,
});
