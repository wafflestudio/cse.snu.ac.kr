import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import NotFound from '@/components/layout/NotFound';
import PageLayout from '@/components/layout/PageLayout';
import { dsSubNav, SECTIONS } from './-registry';

// 절 한 페이지. 절 목록은 오른쪽 서브내비(데스크톱), 아래에 목차로 돌아가는 링크.

function DesignSystemSection() {
  const { section: id } = Route.useParams();
  const section = SECTIONS.find((s) => s.id === id);
  if (!section) return null;

  return (
    <PageLayout
      title={section.title}
      breadcrumb={[
        { name: '디자인 시스템', path: '/design-system', localized: false },
        { name: section.group },
      ]}
      subNav={dsSubNav(id)}
      pageTitle={`${section.title} · 디자인 시스템`}
    >
      {section.content}
      <div className="mt-16 border-t border-neutral-200 pt-6 type-ui">
        <Link
          to="/design-system"
          className="inline-flex items-center gap-1 hover:text-main-orange-dark"
        >
          <ArrowLeft /> 디자인 시스템 목차
        </Link>
      </div>
    </PageLayout>
  );
}

export const Route = createFileRoute('/design-system/$section')({
  // 내용(ReactNode)은 로더 데이터로 넘기지 않는다. SSR 이 직렬화하지 못한다. 주소만 검사한다.
  beforeLoad: ({ params }) => {
    if (!SECTIONS.some((s) => s.id === params.section)) throw notFound();
  },
  notFoundComponent: NotFound,
  component: DesignSystemSection,
});
