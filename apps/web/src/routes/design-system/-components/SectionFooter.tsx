import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SECTIONS } from '../-nav';

/** 절 사이 이동. 첫 화면 목차로 되돌아가지 않아도 다음 절로 갈 수 있게 한다. */
export function SectionFooter({ current }: { current: string }) {
  const index = SECTIONS.findIndex((s) => s.to === current);
  const previous = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];

  return (
    <nav
      aria-label="다른 절"
      className="mt-16 flex flex-wrap justify-between gap-6 border-t border-neutral-200 pt-8 text-md/[1.7]"
    >
      {previous ? (
        <Link
          to={previous.to}
          className="group flex items-center gap-2 text-neutral-600 hover:text-main-orange"
        >
          <ArrowLeft className="size-4" />
          {previous.title}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          to={next.to}
          className="group ml-auto flex items-center gap-2 text-neutral-600 hover:text-main-orange"
        >
          {next.title}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </nav>
  );
}
