import { createFileRoute, Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import Node from '@/components/ui/Nodes';
import { SITE_NAME } from '@/constants/site';
import { useLanguage } from '@/hooks/useLanguage';
import Content from './-content.mdx';

export const Route = createFileRoute('/design-system/')({
  component: DesignSystemPage,
});

const TITLE = '디자인 시스템';
const DESCRIPTION =
  '서울대학교 컴퓨터공학부 홈페이지의 시각 언어와 공통 요소, 사용 기준을 소개합니다.';

// 본문은 가로 거터 안에 들어가고, h2 의 구분선만 거터를 포함해 단 전체를 가로지른다.
const GUTTER_X = 'pl-[var(--docs-gutter-start)] pr-[var(--docs-gutter-end)]';

// 마크다운이 만드는 요소의 생김새. 본문이 직접 쓰는 컴포넌트는 MDX 가 import 한다.
const components = {
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="-mr-[var(--docs-gutter-end)] -ml-[var(--docs-gutter-start)] mt-16 border-t border-neutral-200 pr-[var(--docs-gutter-end)] pl-[var(--docs-gutter-start)] pt-13 text-2xl/[1.4] font-bold text-neutral-900 max-sm:mt-9 max-sm:pt-9 max-sm:text-xl/[1.4]">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-14 text-lg/[1.4] font-bold text-neutral-900">
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: ReactNode }) => (
    <h4 className="mt-8 mb-2 max-w-[560px] text-md/[1.85] font-bold text-neutral-900">
      {children}
    </h4>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mt-4 max-w-[560px] text-md/[1.85] break-keep text-neutral-600">
      {children}
    </p>
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code className="text-neutral-700">{children}</code>
  ),
  a: ({ children, href }: { children?: ReactNode; href?: string }) => (
    <a
      className="text-link underline underline-offset-2"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="mt-5 max-w-[720px] overflow-x-auto">
      <table className="w-full border-collapse text-md/[1.7] text-neutral-600">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="border-b border-neutral-300 px-3 py-2 text-left text-xs/[1.7] font-medium text-neutral-500">
      {children}
    </th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="border-b border-neutral-100 px-3 py-2.5 align-top [&_code]:whitespace-nowrap">
      {children}
    </td>
  ),
};

function DesignSystemPage() {
  const { locale, localizedPath } = useLanguage();

  return (
    <div
      className="bg-white text-neutral-900 text-md/[1.7] tracking-normal [--docs-gutter-start:100px] [--docs-gutter-end:160px] max-[1200px]:[--docs-gutter-start:48px] max-[1200px]:[--docs-gutter-end:64px] max-[900px]:[--docs-gutter-start:32px] max-[900px]:[--docs-gutter-end:48px] max-sm:[--docs-gutter-start:20px] max-sm:[--docs-gutter-end:20px] [&_:where(a,button,input,textarea):focus-visible]:outline-2 [&_:where(a,button,input,textarea):focus-visible]:outline-link [&_:where(a,button,input,textarea):focus-visible]:outline-offset-4 [&_svg]:shrink-0 [&_code]:[font-family:ui-monospace,SFMono-Regular,Menlo,monospace] [&_code]:text-xs/[normal] [&_code]:font-normal [&_:where(p,h1,h2,h3,h4,dd,li)]:[overflow-wrap:anywhere] motion-reduce:[&_*]:transition-none motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:scroll-auto"
      id="design-top"
    >
      <title>{`${TITLE} · ${SITE_NAME[locale]}`}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta property="og:title" content={`${TITLE} · ${SITE_NAME[locale]}`} />
      <meta property="og:description" content={DESCRIPTION} />
      <div
        className={`${GUTTER_X} bg-neutral-900 pt-20 pb-11 text-white max-[900px]:pt-13.5 max-[900px]:pb-8 [&_h1]:text-[32px]/[1.3] [&_h1]:font-bold max-sm:[&_h1]:text-2xl/[1.3]`}
      >
        <div className="mb-2 flex w-fit max-w-full items-center gap-2 text-sm/[1.5] text-neutral-300 [&>a]:min-w-0 [&>a]:break-keep [&>a:hover]:text-main-orange">
          <Link to={localizedPath('/')}>서울대학교 컴퓨터공학부</Link>
          <div className="w-33 shrink-0 max-sm:w-24" aria-hidden="true">
            <Node variant="curvedHorizontalGray" />
          </div>
        </div>
        <h1>{TITLE}</h1>
      </div>
      {/* 제목·문단의 간격은 각 컴포넌트가 제 생김새와 함께 들고 있다. 여기 남는 둘은
            컴포넌트가 스스로 알 수 없는 것이다 — 문서가 소유하지 않는 블록(데모)의 기본값과,
            자기가 첫 블록인지. */}
      <div
        className={`${GUTTER_X} min-w-0 pb-16 [&>:not(h2):not(h3):not(h4):not(p)]:mt-7 [&>:first-child]:mt-0 max-sm:pb-9`}
      >
        <Content components={components} />
      </div>
    </div>
  );
}
