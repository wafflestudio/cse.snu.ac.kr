import { createFileRoute, Link } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { DS_SUBNAV, GROUPS } from './-registry';

// 디자인 시스템 첫 페이지: 정체성과 묶음별 목차. 절은 각자 페이지(/design-system/<id>).

function DesignSystemHome() {
  return (
    <PageLayout
      title="디자인 시스템"
      breadcrumb={[]}
      subNav={DS_SUBNAV}
      pageTitle="디자인 시스템"
      pageDescription="서울대학교 컴퓨터공학부 웹사이트의 디자인 규칙"
    >
      <Identity />
      <Contents />
    </PageLayout>
  );
}

function Identity() {
  return (
    <section className="mb-16 max-w-xl">
      <h2 className="text-2xl font-bold">추상의 구상</h2>
      <p className="mt-4 text-md leading-7 text-neutral-700">
        컴퓨터공학은 0과 1에서 출발해 추상화의 층위를 쌓아갑니다. 하나의 구조가
        다음 층위의 단위가 되고, 그 위에 더 복잡한 시스템이 세워집니다.
      </p>
      <p className="mt-4 text-md leading-7 text-neutral-700">
        서울대학교 컴퓨터공학부의 디자인은 이 사고방식을 시각 언어로 옮깁니다.
        간결한 형태가 정보를 담는 단위가 되고, 단위 사이의 관계가 화면의 질서를
        만듭니다. 정보를 구성하는 방식에 학문의 정체성을 담습니다.
      </p>
      <p className="mt-6 text-sm text-neutral-500">
        이 페이지가 디자인 규칙의 정본입니다. 화면을 만들 때 여기에 없는 값이나
        모양을 새로 만들지 않습니다.
      </p>
    </section>
  );
}

function Contents() {
  return (
    <nav aria-label="목차" className="grid gap-12 sm:grid-cols-2">
      {GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="type-section">{group.title}</h2>
          <p className="mt-2 type-meta text-neutral-500">{group.description}</p>
          <ul className="mt-4 border-t border-neutral-200">
            {group.sections.map((section) => (
              <li key={section.id} className="border-b border-neutral-200">
                <Link
                  to="/design-system/$section"
                  params={{ section: section.id }}
                  className="flex h-11 items-center type-ui text-neutral-950 hover:text-main-orange"
                >
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}

export const Route = createFileRoute('/design-system/')({
  component: DesignSystemHome,
});
