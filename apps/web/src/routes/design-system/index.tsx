import { createFileRoute, Link } from '@tanstack/react-router';
import Intro from './-intro.mdx';
import { mdxComponents } from './-mdx';
import { SECTIONS } from './-nav';

export const Route = createFileRoute('/design-system/')({
  component: DesignSystemIndex,
});

function DesignSystemIndex() {
  return (
    <>
      <Intro components={mdxComponents} />
      <ul className="mt-11 grid max-w-[720px] grid-cols-2 gap-x-8 gap-y-7 max-sm:grid-cols-1">
        {SECTIONS.map((section) => (
          <li key={section.to}>
            <Link to={section.to} className="group block">
              <span className="text-lg/[1.4] font-bold text-neutral-900 group-hover:text-main-orange">
                {section.title}
              </span>
              <span className="mt-1 block text-md/[1.7] break-keep text-neutral-600">
                {section.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
