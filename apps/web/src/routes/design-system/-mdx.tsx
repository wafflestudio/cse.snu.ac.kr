import type { ReactNode } from 'react';

/**
 * 마크다운이 만드는 요소의 생김새. 본문이 직접 쓰는 컴포넌트는 MDX 가 import 한다.
 * 절 제목은 라우트가 머리글에서 h1 으로 내놓으므로 본문은 h2 에서 시작한다.
 */
export const mdxComponents = {
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-14 text-lg/[1.4] font-bold text-neutral-900">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-8 mb-2 max-w-[560px] text-md/[1.85] font-bold text-neutral-900">
      {children}
    </h3>
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
