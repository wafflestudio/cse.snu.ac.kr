import clsx from 'clsx';
import { ChevronsLeftRight } from 'lucide-react';
import {
  isValidElement,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useRef,
  useState,
} from 'react';
import PillGroup from '@/components/ui/PillGroup';

// 개선 전후 한 쌍을 보여 주는 틀. 보기 방식(나란히 · 전 · 후 · 겹쳐 보기)은 카드마다 고른다.
//
// 높이가 바뀌지 않게: 두 쪽을 언제나 같은 칸에 함께 그리고 보이지 않는 쪽은 visibility 로만 숨긴다.
// 칸 높이는 늘 둘 중 높은 쪽이고, 데스크톱의 한 쪽 보기는 나란히의 한 칸 폭과 같아 배율도 같다.
// 기본은 어느 폭에서나 "나란히"(모바일도 두 칸).

// ── 한쪽 내용 ─────────────────────────────────────────────────────

// 캡처 한 장. src 는 public 아래 경로, w·h 는 파일의 실제 픽셀 크기.
export type Shot = {
  kind: 'shot';
  src: string;
  w: number;
  h: number;
  alt: string;
};

// 한쪽은 캡처이거나 실제 부품 견본이다.
export type Side = Shot | ReactNode;

const isShot = (side: Side): side is Shot =>
  typeof side === 'object' &&
  side !== null &&
  !isValidElement(side) &&
  (side as Shot).kind === 'shot';

// 같은 크기의 캡처 두 장만 겹쳐 볼 수 있다.
function overlayable(before: Side, after: Side): [Shot, Shot] | null {
  if (!isShot(before) || !isShot(after)) return null;
  return before.w === after.w && before.h === after.h ? [before, after] : null;
}

// 좁은 칸에서는 작게 보이므로 누르면 원래 크기로 연다.
// share 는 짝 중 넓은 쪽에 대한 폭 비율(같은 배율로 줄이려고).
function ShotLink({ shot, share }: { shot: Shot; share: number }) {
  return (
    <a
      href={shot.src}
      className="block"
      style={{ width: `${share * 100}%`, maxWidth: shot.w }}
    >
      <img
        src={shot.src}
        width={shot.w}
        height={shot.h}
        alt={shot.alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </a>
  );
}

// ── 보기 방식 ─────────────────────────────────────────────────────

// 카드마다 따로 고른다(기본 나란히, 저장하지 않는다).
type Mode = 'side' | 'before' | 'after' | 'overlay';

// ── 한 쌍 ─────────────────────────────────────────────────────────

const LABEL = { before: '전', after: '후' } as const;

function Caption({ side }: { side: 'before' | 'after' }) {
  return (
    <span
      className={clsx(
        'block border-t-3 pt-2 type-label',
        side === 'after'
          ? 'border-neutral-950 text-neutral-950'
          : 'border-neutral-300 text-neutral-500',
      )}
    >
      {LABEL[side]}
    </span>
  );
}

const FRAME =
  'flex min-h-24 flex-1 flex-wrap items-center justify-center gap-3 overflow-hidden border border-neutral-200 bg-white p-4 sm:p-6';

function Pane({
  side,
  hide,
  className,
  children,
}: {
  side: 'before' | 'after';
  hide: string | false; // 숨길 때의 클래스. 자리를 지키도록 invisible 로만 숨긴다
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={clsx(
        'col-start-1 row-start-1 flex min-w-0 flex-col',
        hide,
        className,
      )}
    >
      <figcaption className="mb-3">
        <Caption side={side} />
      </figcaption>
      <div className={FRAME}>{children}</div>
    </figure>
  );
}

// 겹쳐 보기: 경계 왼쪽은 전, 오른쪽은 후.
function Overlay({
  before,
  after,
  className,
}: {
  before: Shot;
  after: Shot;
  className: string;
}) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);

  const moveTo = (clientX: number) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.round(Math.min(100, Math.max(0, ratio))));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 5;
    const next = {
      ArrowLeft: pos - step,
      ArrowDown: pos - step,
      ArrowRight: pos + step,
      ArrowUp: pos + step,
      PageDown: pos - 10,
      PageUp: pos + 10,
      Home: 0,
      End: 100,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setPos(Math.min(100, Math.max(0, next)));
  };

  return (
    <figure
      className={clsx(
        'col-start-1 row-start-1 flex min-w-0 flex-col',
        className,
      )}
    >
      <figcaption className="mb-3 grid grid-cols-2">
        <Caption side="before" />
        <span className="text-right">
          <Caption side="after" />
        </span>
      </figcaption>
      <div className={FRAME}>
        <div
          ref={box}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          className="relative w-full cursor-ew-resize touch-pan-y select-none"
          style={{ maxWidth: before.w }}
        >
          <img
            src={before.src}
            width={before.w}
            height={before.h}
            alt={before.alt}
            draggable={false}
            decoding="async"
            className="block h-auto w-full"
          />
          <img
            src={after.src}
            width={after.w}
            height={after.h}
            alt={after.alt}
            draggable={false}
            decoding="async"
            className="absolute inset-0 block h-full w-full"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-neutral-950"
            style={{ left: `${pos}%` }}
          >
            <div
              role="slider"
              tabIndex={0}
              aria-label="전후 경계"
              aria-orientation="horizontal"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pos}
              aria-valuetext={`왼쪽 전 ${pos}%, 오른쪽 후 ${100 - pos}%`}
              onKeyDown={onKeyDown}
              className="pointer-events-auto absolute top-1/2 left-1/2 grid size-6 -translate-1/2 cursor-ew-resize place-items-center rounded-full border border-neutral-950 bg-white"
            >
              <ChevronsLeftRight aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

// 데스크톱에서 한 쪽만 볼 때의 폭: 나란히의 한 칸(gap-6 의 절반을 뺀 50%)과 같게 해 배율을 지킨다.
const ONE_COLUMN = 'sm:w-[calc(50%-0.75rem)] sm:justify-self-center';

export function Compare({
  before,
  after,
  label,
  full = false,
}: {
  before: Side;
  after: Side;
  label?: string; // 변형마다 짝지을 때 변형 이름
  full?: boolean; // 본문 폭이 있어야 보이는 견본: 나란히 없이 한 쪽씩 본문 폭 전체로 본다
}) {
  const [mode, setMode] = useState<Mode>('side');
  const pair = overlayable(before, after);
  // 겹쳐 볼 수 없는 쌍에서 겹쳐 보기가 골라져 있으면 나란히로 그린다.
  let shown: Mode = mode === 'overlay' && !pair ? 'side' : mode;
  if (full && shown === 'side') shown = 'before';
  const side = shown === 'side';
  const one = full ? undefined : ONE_COLUMN;

  // 크기가 다른 두 캡처는 같은 배율로 줄여 크기 차이가 그대로 보이게 한다.
  const widest = Math.max(
    isShot(before) ? before.w : 0,
    isShot(after) ? after.w : 0,
  );
  const content = (s: Side) =>
    isShot(s) ? <ShotLink shot={s} share={s.w / widest} /> : s;

  const options = [
    { value: 'before', label: '전' },
    { value: 'after', label: '후' },
    ...(pair ? [{ value: 'overlay', label: '겹쳐 보기' }] : []),
  ] as { value: Mode; label: string }[];
  const ariaLabel = label ? `${label} 전후 보기` : '전후 보기';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {label ? <p className="type-label">{label}</p> : <span />}
        <PillGroup
          ariaLabel={ariaLabel}
          options={
            full ? options : [{ value: 'side', label: '나란히' }, ...options]
          }
          value={shown}
          onChange={setMode}
        />
      </div>
      <div className={clsx('grid gap-3 sm:gap-6', side && 'grid-cols-2')}>
        <Pane
          side="before"
          hide={side || shown === 'before' ? false : 'invisible'}
          className={side ? undefined : one}
        >
          {content(before)}
        </Pane>
        <Pane
          side="after"
          hide={side || shown === 'after' ? false : 'invisible'}
          className={side ? 'col-start-2' : one}
        >
          {content(after)}
        </Pane>
        {pair && shown === 'overlay' && (
          <Overlay before={pair[0]} after={pair[1]} className={one ?? ''} />
        )}
      </div>
    </div>
  );
}
