import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Lead, RuleList } from '../../-components/doc';
import { Compare, type Shot, type Side } from './compare';

// v2 개선 기록 네 페이지(기반·컴포넌트·패턴·공통)가 함께 쓰는 틀.
// 한 화면이 눈에 띄게 바뀐 것은 전후(캡처·견본), 여러 화면에 흩어진 값을 하나로 모은 것은 "예전 값 → 지금 값" 표.
// 캡처는 .ds-review 에서 잘라 public/design-system/changes 에 둔다. 견본·표의 예전 값은 base 커밋(d1baf83c) 코드에서 옮겼다.

// [자리, 예전 값, 지금 값]
type ValueRow = [place: string, before: string, now: string];

type Item = {
  title: string;
  why: string;
  pairs?: Pair[]; // 여러 벌이 하나로 모인 변화: 변형마다 전·후를 한 줄씩
  values?: ValueRow[];
  more?: string; // 표 아래 "그 밖에 N곳" 같은 한 줄
  same?: string[]; // 전후 견본과 똑같이 바뀐 다른 자리(견본 아래 한 줄)
  before?: Side;
  after?: Side;
  full?: boolean; // 본문 폭이 있어야 차이가 보이는 견본(입력 칸 폭 등): 나란히 없이 한 쪽씩
};

export type Area = {
  id: string;
  title: string;
  doc?: string; // 규칙 페이지 id
  items: Item[];
  extras?: string[];
};

// ── 캡처 ──────────────────────────────────────────────────────────

const shot = (file: string, w: number, h: number, alt: string): Shot => ({
  kind: 'shot',
  src: `/design-system/changes/${file}.webp`,
  w,
  h,
  alt,
});

// 전후 캡처 한 쌍. 후 쪽 크기가 다르면 after 로 따로 준다.
export function shots(
  name: string,
  w: number,
  h: number,
  alts: [before: string, after: string],
  after?: { w: number; h: number },
) {
  return {
    before: shot(`${name}-before`, w, h, alts[0]),
    after: shot(`${name}-after`, after?.w ?? w, after?.h ?? h, alts[1]),
  };
}

// 여러 벌이 하나로 모인 변화: 변형마다 전·후를 한 쌍씩. file 은 확장자 뺀 파일 이름.
export type Pair = { label: string; before: Side; after: Side };

type GalleryShot = {
  file: string;
  w: number;
  h: number;
  label: string;
  alt: string;
};

// 같은 순서의 전·후 캡처 목록을 변형마다 한 쌍으로 묶는다. 이름표는 전 쪽 것을 쓴다.
export function pairShots(before: GalleryShot[], after: GalleryShot[]) {
  return {
    pairs: before.map(
      (b, i): Pair => ({
        label: b.label,
        before: shot(b.file, b.w, b.h, b.alt),
        after: shot(after[i].file, after[i].w, after[i].h, after[i].alt),
      }),
    ),
  };
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

function ChangeItem({ item }: { item: Item }) {
  return (
    <article className="space-y-4">
      <h3 className="type-item">{item.title}</h3>
      <p className="max-w-160 type-ui leading-normal text-neutral-700">
        {item.why}
      </p>
      {item.before !== undefined && item.after !== undefined && (
        <Compare before={item.before} after={item.after} full={item.full} />
      )}
      {item.pairs?.map((pair) => (
        <Compare
          key={pair.label}
          label={pair.label}
          before={pair.before}
          after={pair.after}
        />
      ))}
      {item.same && (
        <p className="max-w-160 type-meta leading-normal text-neutral-500">
          같은 변경: {item.same.join(', ')}
        </p>
      )}
      {item.values && <ValueTable rows={item.values} />}
      {item.more && <p className="type-meta text-neutral-500">{item.more}</p>}
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
            className="inline-flex items-center gap-1 type-meta text-neutral-600 hover:text-main-orange-dark"
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
          <RuleList items={area.extras} />
        </div>
      )}
    </section>
  );
}

// note: 리드 아래 한 줄. 싣는 기준은 첫 페이지(기반 개선)에만 적는다.
export function ChangesPage({
  lead,
  note,
  areas,
}: {
  lead: ReactNode;
  note?: ReactNode;
  areas: Area[];
}) {
  return (
    <>
      <Lead>{lead}</Lead>
      {note && (
        <p className="-mt-8 mb-12 max-w-160 type-ui leading-normal text-neutral-700">
          {note}
        </p>
      )}
      <div className="space-y-16">
        {areas.map((area) => (
          <AreaBlock key={area.id} area={area} />
        ))}
      </div>
    </>
  );
}
