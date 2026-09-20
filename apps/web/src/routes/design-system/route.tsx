import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import Node from '@/components/ui/Nodes';
import { SITE_NAME } from '@/constants/site';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionFooter } from './-components/SectionFooter';
import { SECTIONS } from './-nav';

export const Route = createFileRoute('/design-system')({
  component: DesignSystemLayout,
});

export const TITLE = '디자인 시스템';
const DESCRIPTION =
  '서울대학교 컴퓨터공학부 홈페이지의 시각 언어와 공통 요소, 사용 기준을 소개합니다.';

// 본문은 가로 거터 안에 들어가고, 내비도 그 안에서 한 칸을 차지한다.
const GUTTER_X = 'pl-[var(--docs-gutter-start)] pr-[var(--docs-gutter-end)]';

function DesignSystemLayout() {
  const { locale, localizedPath } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const section = SECTIONS.find((s) => s.to === pathname.replace(/\/$/, ''));
  const title = section ? section.title : TITLE;
  const pageTitle = section ? `${section.title} · ${TITLE}` : TITLE;

  return (
    <div
      className="bg-white text-neutral-900 text-md/[1.7] tracking-normal [--docs-gutter-start:100px] [--docs-gutter-end:160px] max-[1200px]:[--docs-gutter-start:48px] max-[1200px]:[--docs-gutter-end:64px] max-[900px]:[--docs-gutter-start:32px] max-[900px]:[--docs-gutter-end:48px] max-sm:[--docs-gutter-start:20px] max-sm:[--docs-gutter-end:20px] [&_:where(a,button,input,textarea):focus-visible]:outline-2 [&_:where(a,button,input,textarea):focus-visible]:outline-neutral-800 [&_:where(a,button,input,textarea):focus-visible]:outline-offset-2 [&_svg]:shrink-0 [&_code]:[font-family:ui-monospace,SFMono-Regular,Menlo,monospace] [&_code]:text-xs/[normal] [&_code]:font-normal [&_:where(p,h1,h2,h3,h4,dd,li)]:[overflow-wrap:anywhere] motion-reduce:[&_*]:transition-none motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:scroll-auto"
      id="design-top"
    >
      <title>{`${pageTitle} · ${SITE_NAME[locale]}`}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta
        property="og:title"
        content={`${pageTitle} · ${SITE_NAME[locale]}`}
      />
      <meta property="og:description" content={DESCRIPTION} />
      <div
        className={`${GUTTER_X} bg-neutral-900 pt-20 pb-11 text-white max-[900px]:pt-13.5 max-[900px]:pb-8 [&_h1]:text-[32px]/[1.3] [&_h1]:font-bold max-sm:[&_h1]:text-2xl/[1.3]`}
      >
        {/* 앱의 `PageTitle` 과 같은 짜임 — 항목 사이에 12px 갈매기, 끝에 연결선. */}
        <ol className="mb-2 flex w-fit max-w-full items-center gap-0.5 text-sm/[1.5] text-neutral-300 [&_a]:min-w-0 [&_a]:break-keep [&_a:hover]:text-main-orange">
          <li className="flex min-w-0">
            <Link to={localizedPath('/')}>서울대학교 컴퓨터공학부</Link>
          </li>
          {section && (
            <>
              <li className="flex">
                <ChevronRight className="size-3" />
              </li>
              <li className="flex min-w-0">
                <Link to="/design-system">{TITLE}</Link>
              </li>
            </>
          )}
          <li className="ml-1.5 w-33 shrink-0 max-sm:w-24" aria-hidden="true">
            <Node variant="curvedHorizontalGray" />
          </li>
        </ol>
        <h1>{title}</h1>
      </div>
      {/* 제목·문단의 간격은 각 컴포넌트가 제 생김새와 함께 들고 있다. 여기 남는 둘은
          컴포넌트가 스스로 알 수 없는 것이다 — 문서가 소유하지 않는 블록(데모)의 기본값과,
          자기가 첫 블록인지. */}
      <div
        className={`${GUTTER_X} min-w-0 pt-[var(--docs-gap-top)] pb-16 [--docs-gap-top:44px] [&>:not(h2):not(h3):not(p):not([data-bleed])]:mt-7 [&>:first-child:not([data-bleed])]:mt-0 max-sm:pb-9 max-sm:[--docs-gap-top:32px]`}
      >
        <Outlet />
        {section && <SectionFooter current={section.to} />}
      </div>
    </div>
  );
}
