import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import PillGroup from '@/components/ui/PillGroup';

// 디자인 시스템 문서 페이지의 틀 한 벌. 부품 페이지는 이 순서로 쓴다:
// 한 줄 설명(Lead) → 예시(Example) → 종류(VariantTable) → 사용하는 경우 → 사용하지 않는 경우 → 작동 방식 → Do · Don't.
// 기반(색·글자·간격…)은 값 → 원칙 → 알려진 예외(KnownGap) → Do · Don't. 패턴은 짜임 그림 → 작동 방식 → Do · Don't.
// 쓰는 사람이 정해야 하는 것만 적는다. 부품이 정하는 값(크기·여백·호버 색)은 예시가 보여 주고 소스가 정본이다.
// 규칙은 한 문장에 이유를 붙인다(이유가 없으면 당연하거나 근거 없는 규칙이라 뺀다). 값을 늘어놓기보다 역할·원칙으로 쓴다.
// 세기: "반드시 …해야 합니다"(접근성·정확성, 드물게) · "…합니다"(기본) · "…하지 않습니다"(금지) · "…을 고려합니다"(권장).
// 예외는 규칙으로 만들지 않고 KnownGap 한 줄에 이유와 함께 적는다.
// Do · Don't 는 이번 개편 전 사이트가 실제로 하던 것(Don't)과 바꾼 규칙(Do)만 싣는다.
// 폭에 따라 달라지는 것은 DeviceToggle 로 바꿔 보게 한다. 첫 줄 설명(Lead)은 한 문장. 코드는 싣지 않는다.

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

// 짧은 규칙 목록(한 항목 한 문장).
export function RuleList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 type-ui leading-normal">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// 알려진 예외·한계 한 줄. 규칙으로 만들지 않고 이유와 함께 적는다.
export function KnownGap({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-160 border-l-2 border-neutral-300 pl-4 type-ui leading-normal text-neutral-700">
      <span className="mr-2 type-label text-neutral-950">알려진 예외</span>
      {children}
    </p>
  );
}

// Do / Don't 를 한 쌍으로 나란히 둔다. 규칙 문장은 각 카드 아래에 붙인다.
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
          {ok ? 'Do' : "Don't"}
        </span>
        {caption}
      </figcaption>
    </figure>
  );
}

// 값 표: 이름 · 값 · 쓰는 곳. 기반 페이지(토큰·단계)와 짜임 값에만 쓴다. 부품이 정하는 값은 적지 않는다.
export function SpecTable({
  head = ['이름', '값', '사용처'],
  rows,
}: {
  head?: [string, string, string];
  rows: [ReactNode, ReactNode, ReactNode?][];
}) {
  return (
    // 모바일은 셋째 칸(사용처)을 아래 줄로 내린다. 좁은 폭에서 한두 글자씩 끊기지 않게.
    <div className="grid grid-cols-[auto_minmax(0,1fr)] border-y border-neutral-200 type-ui sm:grid-cols-[auto_auto_minmax(0,1fr)]">
      <div className="col-span-full grid h-11 grid-cols-subgrid items-center border-b border-neutral-200 type-label">
        {head.map((h, i) => (
          <span key={h} className={i === 2 ? 'hidden px-3 sm:block' : 'px-3'}>
            {h}
          </span>
        ))}
      </div>
      {rows.map(([name, value, note], i) => (
        <div
          key={i}
          className="col-span-full grid min-h-11 grid-cols-subgrid items-center py-2 odd:bg-neutral-50 sm:py-0"
        >
          <span className="px-3 sm:py-2">{name}</span>
          <span className="px-3 whitespace-nowrap sm:py-2">{value}</span>
          {note && (
            <span className="col-span-full px-3 pt-1 text-neutral-500 sm:col-span-1 sm:py-2">
              {note}
            </span>
          )}
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
