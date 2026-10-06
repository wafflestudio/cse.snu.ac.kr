import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Lead, RuleList } from '../../-components/doc';

// v2 개선 기록 네 페이지(기반·컴포넌트·패턴·공통)가 함께 쓰는 틀.
// 한 화면이 눈에 띄게 바뀐 것은 전후(캡처·견본), 여러 화면에 흩어진 값을 하나로 모은 것은 "예전 값 → 지금 값" 표.
// 캡처는 .ds-review 에서 잘라 public/design-system/changes 에 둔다. 견본·표의 예전 값은 base 커밋(d1baf83c) 코드에서 옮겼다.

// [자리, 예전 값, 지금 값]
export type ValueRow = [place: string, before: string, now: string];

export type Item = {
  title: string;
  why: string;
  values?: ValueRow[];
  more?: string; // 표 아래 "그 밖에 N곳" 같은 한 줄
  before?: ReactNode;
  after?: ReactNode;
  wide?: boolean; // 넓은 캡처는 전·후를 위아래로 쌓는다
};

export type Area = {
  id: string;
  title: string;
  doc?: string; // 규칙 페이지 id
  items: Item[];
  extras?: string[];
};

// ── 캡처 ──────────────────────────────────────────────────────────

function Shot({
  name,
  side,
  w,
  h,
  alt,
}: {
  name: string;
  side: 'before' | 'after';
  w: number;
  h: number;
  alt: string;
}) {
  const src = `/design-system/changes/${name}-${side}.webp`;
  // 좁은 화면에서는 작게 보이므로 누르면 원래 크기로 연다.
  return (
    <a href={src} className="block w-full" style={{ maxWidth: w }}>
      <img
        src={src}
        width={w}
        height={h}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </a>
  );
}

// 같은 크기의 전후 캡처 한 쌍.
export function shots(
  name: string,
  w: number,
  h: number,
  alts: [before: string, after: string],
  after?: { w: number; h: number },
) {
  return {
    before: <Shot name={name} side="before" w={w} h={h} alt={alts[0]} />,
    after: (
      <Shot
        name={name}
        side="after"
        w={after?.w ?? w}
        h={after?.h ?? h}
        alt={alts[1]}
      />
    ),
  };
}

// 여러 벌이 하나로 모인 변화: 한쪽에 변형 여러 개를 이름과 함께 쌓는다. file 은 확장자 뺀 파일 이름.
type GalleryShot = {
  file: string;
  w: number;
  h: number;
  label: string;
  alt: string;
};

export function Gallery({ shots: list }: { shots: GalleryShot[] }) {
  return (
    <div className="grid w-full gap-6">
      {list.map((shot) => {
        const src = `/design-system/changes/${shot.file}.webp`;
        return (
          <div key={shot.file} className="min-w-0">
            <p className="mb-2 type-meta text-neutral-500">{shot.label}</p>
            <a href={src} className="block w-full" style={{ maxWidth: shot.w }}>
              <img
                src={src}
                width={shot.w}
                height={shot.h}
                alt={shot.alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full border border-neutral-100"
              />
            </a>
          </div>
        );
      })}
    </div>
  );
}

// ── 값 표 ─────────────────────────────────────────────────────────

// 데스크톱은 자리 · 예전 값 · 지금 값 세 칸, 모바일은 자리 아래에 "예전 → 지금" 한 줄.
function ValueTable({ rows }: { rows: ValueRow[] }) {
  return (
    <div className="grid border-y border-neutral-200 type-ui sm:grid-cols-[auto_auto_minmax(0,1fr)]">
      <div className="hidden h-11 items-center border-b border-neutral-200 type-label sm:col-span-full sm:grid sm:grid-cols-subgrid">
        <span className="px-3">자리</span>
        <span className="px-3">예전 값</span>
        <span className="px-3">지금 값</span>
      </div>
      {rows.map(([place, before, now]) => (
        <div
          key={place}
          className="grid min-h-11 items-center gap-1 px-3 py-2 odd:bg-neutral-50 sm:col-span-full sm:grid-cols-subgrid sm:gap-0 sm:px-0 sm:py-0"
        >
          <span className="type-label sm:px-3 sm:py-2 sm:type-ui">{place}</span>
          <span className="flex flex-wrap items-center gap-x-2 sm:contents">
            <span className="text-neutral-500 sm:px-3 sm:py-2">{before}</span>
            <ArrowRight className="text-neutral-400 sm:hidden" />
            <span className="sm:px-3 sm:py-2">{now}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ── 카드 ──────────────────────────────────────────────────────────

function Pane({
  side,
  children,
}: {
  side: 'before' | 'after';
  children: ReactNode;
}) {
  const after = side === 'after';
  return (
    <figure className="flex min-w-0 flex-col">
      <figcaption
        className={clsx(
          'mb-3 border-t-3 pt-2 type-label',
          after
            ? 'border-neutral-950 text-neutral-950'
            : 'border-neutral-300 text-neutral-500',
        )}
      >
        {after ? '후' : '전'}
      </figcaption>
      <div className="flex min-h-24 flex-1 flex-wrap items-center justify-center gap-3 overflow-hidden border border-neutral-200 bg-white p-4 sm:p-6">
        {children}
      </div>
    </figure>
  );
}

function ChangeItem({ item }: { item: Item }) {
  return (
    <article className="space-y-4">
      <h3 className="type-item">{item.title}</h3>
      <p className="max-w-160 type-ui leading-normal text-neutral-700">
        {item.why}
      </p>
      {item.values && <ValueTable rows={item.values} />}
      {item.more && <p className="type-meta text-neutral-500">{item.more}</p>}
      {item.before !== undefined && item.after !== undefined && (
        <div className={clsx('grid gap-6', !item.wide && 'sm:grid-cols-2')}>
          <Pane side="before">{item.before}</Pane>
          <Pane side="after">{item.after}</Pane>
        </div>
      )}
    </article>
  );
}

function AreaBlock({ area }: { area: Area }) {
  return (
    <section id={`change-${area.id}`} className="scroll-mt-8 space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-neutral-950 pb-3">
        <h2 className="type-section">{area.title}</h2>
        {area.doc && (
          <Link
            to="/design-system/$section"
            params={{ section: area.doc }}
            className="inline-flex items-center gap-1 type-meta text-neutral-600 hover:text-main-orange"
          >
            규칙 보기 <ArrowRight />
          </Link>
        )}
      </div>
      {area.items.map((item) => (
        <ChangeItem key={item.title} item={item} />
      ))}
      {area.extras && area.extras.length > 0 && (
        <div className="max-w-160 space-y-3">
          <h3 className="type-label">
            {area.items.length > 0 ? '그 밖에' : '바뀐 것'}
          </h3>
          <p className="type-meta text-neutral-500">
            코드 정리이거나 차이가 너무 작아 전후 없이 한 줄로 적은 것입니다.
          </p>
          <RuleList items={area.extras} />
        </div>
      )}
    </section>
  );
}

export function ChangesPage({
  lead,
  areas,
}: {
  lead: ReactNode;
  areas: Area[];
}) {
  return (
    <>
      <Lead>{lead}</Lead>
      <p className="-mt-8 mb-12 max-w-160 type-ui leading-normal text-neutral-700">
        여러 화면이나 핵심 화면에서 보이는 변화, 접근성·사용성 문제를 고친 것,
        화면을 만드는 규칙을 바꾼 것, 여러 벌을 하나로 모은 것은 카드로 싣고,
        코드 정리이거나 차이가 너무 작은 것만 "그 밖에"에 한 줄로 적습니다.
      </p>
      <div className="space-y-16">
        {areas.map((area) => (
          <AreaBlock key={area.id} area={area} />
        ))}
      </div>
    </>
  );
}
