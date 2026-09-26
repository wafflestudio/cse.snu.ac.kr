import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import NotFound from '@/components/layout/NotFound';
import PageLayout from '@/components/layout/PageLayout';
import { dsSubNav, SECTIONS } from './-registry';

// 절 한 페이지. 목차는 오른쪽 서브내비(데스크톱), 아래에 이전·다음 절.

function DesignSystemSection() {
  const { section: id } = Route.useParams();
  const index = SECTIONS.findIndex((s) => s.id === id);
  const section = SECTIONS[index];
  const prev = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];

  return (
    <PageLayout
      title={section.title}
      breadcrumb={[{ name: '디자인 시스템' }, { name: section.group }]}
      subNav={dsSubNav(id)}
      pageTitle={`${section.title} · 디자인 시스템`}
    >
      {section.content}
      <nav
        aria-label="이전·다음 절"
        className="mt-16 flex justify-between gap-6 border-t border-neutral-200 pt-6 type-ui"
      >
        {prev ? (
          <Link
            to="/design-system/$section"
            params={{ section: prev.id }}
            className="flex items-center gap-1 hover:text-main-orange"
          >
            <ArrowLeft /> {prev.title}
          </Link>
        ) : (
          <Link
            to="/design-system"
            className="flex items-center gap-1 hover:text-main-orange"
          >
            <ArrowLeft /> 목차
          </Link>
        )}
        {next && (
          <Link
            to="/design-system/$section"
            params={{ section: next.id }}
            className="flex items-center gap-1 hover:text-main-orange"
          >
            {next.title} <ArrowRight />
          </Link>
        )}
      </nav>
    </PageLayout>
  );
}

export const Route = createFileRoute('/design-system/$section')({
  // 내용(ReactNode)은 로더 데이터로 넘기지 않는다 — SSR 이 직렬화하지 못한다. 주소만 검사한다.
  beforeLoad: ({ params }) => {
    if (!SECTIONS.some((s) => s.id === params.section)) throw notFound();
  },
  notFoundComponent: NotFound,
  component: DesignSystemSection,
});
