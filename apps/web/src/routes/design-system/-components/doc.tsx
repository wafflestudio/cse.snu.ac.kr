import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import PillGroup from '@/components/ui/PillGroup';

// 디자인 시스템 문서 페이지의 틀 한 벌. 부품 페이지는 이 순서로 쓴다:
// 한 줄 설명(Lead) → 예시(Example) → 종류(VariantTable) → 대신 쓰는 것 → 배치 → 이렇게·이렇게 하지 않는다(DoDont) → 관련(Related).
// 쓰는 사람이 정해야 하는 것만 적는다 — 부품이 정하는 값(크기·여백·호버 색)은 예시가 보여 주고 소스가 정본이다.
// 규칙은 그림에 붙여 쓴다. 코드는 싣지 않는다.
// 폭에 따라 달라지는 것은 DeviceToggle 로 바꿔 보게 한다. 첫 줄 설명(Lead)은 한 문장.
// 기반(색·글자·간격…)은 값 자체가 고르는 대상이라 값 표(SpecTable)를 쓴다: 한 줄 설명 → 값 → 쓰는 법 → 이렇게·하지 않는다 → 관련.
// 패턴·화면은 짜임 그림 → 규칙(RuleList) → 이렇게·하지 않는다 → 관련. 짜는 사람이 고르는 간격 값은 적는다.

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="mb-12 max-w-160 type-body text-neutral-700">{children}</p>
  );
}

export function DocSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-16 space-y-6">
      <h2 className="type-section">{title}</h2>
      {children}
    </section>
  );
}

// 실제 부품을 그리는 상자. tone="dark" 는 어두운 면(헤더·메뉴) 위에서의 모양.
export function Example({
  children,
  caption,
  tone = 'light',
}: {
  children: ReactNode;
  caption?: ReactNode;
  tone?: 'light' | 'dark';
}) {
  return (
    <figure>
      <div
        className={clsx(
          'flex flex-wrap items-center gap-3 border p-8',
          tone === 'dark'
            ? 'border-neutral-850 bg-neutral-900'
            : 'border-neutral-200 bg-white',
        )}
      >
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 type-meta text-neutral-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// 종류 표: 이름 · 견본 · 쓰는 곳.
export function VariantTable({
  rows,
}: {
  rows: { name: string; sample: ReactNode; use: ReactNode; dark?: boolean }[];
}) {
  return (
    <div className="border-y border-neutral-200">
      {rows.map((row) => (
        <div
          key={row.name}
          className="grid items-center gap-3 border-b border-neutral-200 py-4 last:border-none sm:grid-cols-[140px_160px_minmax(0,1fr)] sm:gap-6"
        >
          <p className="type-label">{row.name}</p>
          <div
            className={clsx(
              'flex w-fit items-center',
              row.dark && 'bg-neutral-900 px-3 py-2',
            )}
          >
            {row.sample}
          </div>
          <p className="type-ui text-neutral-600">{row.use}</p>
        </div>
      ))}
    </div>
  );
}

// 짧은 규칙 목록 — 한 항목 한 문장.
export function RuleList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 type-ui leading-normal">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// 이렇게 / 이렇게 하지 않는다 — 한 쌍을 나란히. 규칙 문장은 각 카드 아래에 붙인다.
export function DoDont({
  good,
  bad,
}: {
  good: { example: ReactNode; caption: ReactNode };
  bad: { example: ReactNode; caption: ReactNode };
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Verdict ok example={good.example} caption={good.caption} />
      <Verdict ok={false} example={bad.example} caption={bad.caption} />
    </div>
  );
}

function Verdict({
  ok,
  example,
  caption,
}: {
  ok: boolean;
  example: ReactNode;
  caption: ReactNode;
}) {
  return (
    <figure>
      <div
        className={clsx(
          'flex min-h-32 flex-wrap items-center justify-center gap-3 border border-b-0 bg-white p-6',
          ok ? 'border-neutral-200' : 'border-neutral-200',
        )}
      >
        {example}
      </div>
      <figcaption
        className={clsx(
          'border-t-3 pt-3 type-ui leading-normal',
          ok ? 'border-neutral-950' : 'border-red-600',
        )}
      >
        <span
          className={clsx(
            'mb-1 flex items-center gap-1 type-label',
            ok ? 'text-neutral-950' : 'text-red-600',
          )}
        >
          {ok ? <Check /> : <X />}
          {ok ? '이렇게' : '이렇게 하지 않는다'}
        </span>
        {caption}
      </figcaption>
    </figure>
  );
}

// 값 표: 이름 · 값 · 쓰는 곳. 기반 페이지(토큰·단계)와 짜임 값에만 쓴다 — 부품이 정하는 값은 적지 않는다.
export function SpecTable({
  head = ['이름', '값', '쓰는 곳'],
  rows,
}: {
  head?: [string, string, string];
  rows: [ReactNode, ReactNode, ReactNode?][];
}) {
  return (
    <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] border-y border-neutral-200 type-ui">
      <div className="col-span-full grid h-11 grid-cols-subgrid items-center border-b border-neutral-200 type-label">
        {head.map((h) => (
          <span key={h} className="px-3">
            {h}
          </span>
        ))}
      </div>
      {rows.map(([name, value, note], i) => (
        <div
          key={i}
          className="col-span-full grid min-h-11 grid-cols-subgrid items-center odd:bg-neutral-50"
        >
          <span className="px-3 py-2">{name}</span>
          <span className="px-3 py-2 whitespace-nowrap">{value}</span>
          <span className="px-3 py-2 text-neutral-500">{note}</span>
        </div>
      ))}
    </div>
  );
}

// 폭에 따라 모양이 다른 것은 글 대신 모바일·데스크톱을 바꿔 보게 한다. 두 모양은 쓰는 쪽이 그린다
// (미디어 쿼리는 창 폭을 보므로 실제 부품을 좁은 상자에 넣어도 모바일 모양이 되지 않는다).
export function DeviceToggle({
  mobile,
  desktop,
  caption,
}: {
  mobile: ReactNode;
  desktop: ReactNode;
  caption?: ReactNode;
}) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');
  return (
    <figure className="space-y-3">
      <PillGroup
        ariaLabel="화면 폭"
        options={[
          { value: 'mobile', label: '모바일 390' },
          { value: 'desktop', label: '데스크톱 1440' },
        ]}
        value={device}
        onChange={setDevice}
      />
      <div className="border border-neutral-200 bg-white p-6">
        <div className={device === 'mobile' ? 'w-full max-w-90' : 'w-full'}>
          {device === 'mobile' ? mobile : desktop}
        </div>
      </div>
      {caption && (
        <figcaption className="type-meta text-neutral-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Related({ links }: { links: [id: string, title: string][] }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 type-ui">
      {links.map(([id, title]) => (
        <li key={id}>
          <Link
            to="/design-system/$section"
            params={{ section: id }}
            className="text-link underline underline-offset-2 hover:text-main-orange"
          >
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
