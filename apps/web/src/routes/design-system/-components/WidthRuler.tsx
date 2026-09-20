import { useRef, useState } from 'react';
import { SegmentedControl } from './SegmentedControl';

const MIN = 360;
const MAX = 1920;
const STOPS = [1024, 1280, 1760];

// app.css `.page-gutter-x` 의 식을 그대로 옮긴 것이다. 그쪽 값을 고치면 여기도 고친다.
const SIDEBAR = 100;
const SUBNAV_GAP = 24;
const MOBILE = { edge: 20, edgeEnd: 20, block: 680 };
const DESKTOP = { edge: 100, edgeEnd: 100, block: 1400 };
const SUBNAV = { edge: 100, edgeEnd: 360, block: 1660 };

function solve(width: number, subNav: boolean) {
  const desktop = width >= 1024;
  const wide = desktop && subNav && width >= 1280;
  const t = !desktop ? MOBILE : wide ? SUBNAV : DESKTOP;
  const inner = desktop ? width - SIDEBAR : width;
  const slack = (inner - t.block) / 2;
  const start = Math.round(Math.max(t.edge, slack + t.edge));
  const end = Math.round(Math.max(t.edgeEnd, slack + t.edgeEnd));
  return {
    desktop,
    wide,
    inner,
    start,
    end,
    body: inner - start - end,
    layout: !desktop ? '모바일' : wide ? '데스크톱 · 보조 탐색' : '데스크톱',
  };
}

export function WidthRuler() {
  const [width, setWidth] = useState(1280);
  const [subNav, setSubNav] = useState(true);
  const track = useRef<HTMLDivElement>(null);
  const g = solve(width, subNav);
  const pct = (px: number) => `${(px / g.inner) * 100}%`;

  const drag = (clientX: number) => {
    const box = track.current?.getBoundingClientRect();
    if (!box) return;
    const next = Math.round(((clientX - box.left) / box.width) * MAX);
    setWidth(Math.min(MAX, Math.max(MIN, next)));
  };

  const band = (
    <div
      className="h-6 bg-neutral-800"
      style={{ marginInline: pct(g.start) }}
    />
  );

  return (
    <div className="max-w-[960px]">
      <div className="mb-6 flex flex-wrap items-end gap-x-8 gap-y-4">
        <SegmentedControl
          name="width-ruler-subnav"
          label={'보조 탐색'}
          value={subNav}
          onChange={setSubNav}
          options={[
            { value: true, label: '있음' },
            { value: false, label: '없음' },
          ]}
        />
        <p className="text-xs/[1.7] text-neutral-500">
          {'주황 손잡이를 끌어 화면 폭을 바꿔 보세요.'}
        </p>
      </div>

      <div className="bg-neutral-50 px-5 pt-6 pb-3 max-sm:px-3">
        <div ref={track} className="relative">
          {/* 조각 폭을 화면 폭의 비율로 적으면 축척이 하나로 유지된다. */}
          <div
            className="relative flex h-42 border border-neutral-300 bg-white max-sm:h-32"
            style={{ width: `${(width / MAX) * 100}%` }}
          >
            {g.desktop && (
              <div
                className="shrink-0 bg-neutral-700"
                style={{ width: `${(SIDEBAR / width) * 100}%` }}
              />
            )}
            <div className="flex min-w-0 grow flex-col justify-between py-2">
              {band}
              <div className="flex grow items-stretch">
                <div className="shrink-0" style={{ width: pct(g.start) }} />
                <div
                  className="flex min-w-0 flex-col justify-center gap-1.5 border-x border-dashed border-neutral-300 px-2 text-[10px] text-neutral-500 max-sm:gap-1"
                  style={{ width: pct(g.body) }}
                >
                  <span className="truncate">{'본문'}</span>
                  <i className="block h-1 bg-neutral-200" />
                  <i className="block h-1 w-3/5 bg-neutral-200" />
                </div>
                {g.wide && (
                  <>
                    <div
                      className="shrink-0"
                      style={{ width: pct(SUBNAV_GAP) }}
                    />
                    <div
                      className="grid min-w-0 place-items-center border-l border-dashed border-neutral-300 text-[10px] text-neutral-500"
                      style={{ width: pct(g.end - SUBNAV_GAP - g.start) }}
                    >
                      <span className="truncate px-1">{'보조 탐색'}</span>
                    </div>
                  </>
                )}
                <div
                  className="shrink-0"
                  style={{ width: pct(g.wide ? g.start : g.end) }}
                />
              </div>
              {band}
            </div>
            <button
              type="button"
              role="slider"
              aria-label={'화면 폭'}
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={width}
              aria-valuetext={`${width}px`}
              onPointerDown={(e) =>
                e.currentTarget.setPointerCapture(e.pointerId)
              }
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  drag(e.clientX);
              }}
              onKeyDown={(e) => {
                const far = e.key === 'PageUp' || e.key === 'PageDown';
                const dir =
                  e.key === 'ArrowRight' || e.key === 'PageUp'
                    ? 1
                    : e.key === 'ArrowLeft' || e.key === 'PageDown'
                      ? -1
                      : 0;
                if (!dir) return;
                e.preventDefault();
                setWidth((w) =>
                  Math.min(MAX, Math.max(MIN, w + dir * (far ? 100 : 8))),
                );
              }}
              className="absolute -right-2 top-0 h-full w-4 cursor-ew-resize touch-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
            >
              <span className="mx-auto block h-full w-1 bg-main-orange" />
            </button>
          </div>
          {/* 전환이 일어나는 폭. 눌러서 그 자리로 옮길 수 있다. */}
          <div className="relative mt-2 h-6">
            {STOPS.map((stop) => (
              <button
                key={stop}
                type="button"
                onClick={() => setWidth(stop)}
                className="absolute top-0 -translate-x-1/2 text-[10px] text-neutral-400 before:mx-auto before:mb-1 before:block before:h-2 before:w-px before:bg-neutral-300 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-link"
                style={{ left: `${(stop / MAX) * 100}%` }}
              >
                {stop}
              </button>
            ))}
          </div>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-4 border-y border-neutral-200 py-5 [&_div+div]:border-l [&_div+div]:border-neutral-200 [&_div+div]:pl-5 [&_dt]:text-xs/[inherit] [&_dt]:text-neutral-500 [&_dd]:mt-1.5 [&_dd]:text-xl/[inherit] [&_dd]:font-medium max-sm:grid-cols-2 max-sm:gap-5 max-sm:[&_div:nth-child(3)]:border-l-0 max-sm:[&_div:nth-child(3)]:pl-0">
        <div>
          <dt>{'화면'}</dt>
          <dd>{width}</dd>
        </div>
        <div>
          <dt>{'왼쪽 여백'}</dt>
          <dd>{g.start}</dd>
        </div>
        <div>
          <dt>{'본문'}</dt>
          <dd>{g.body}</dd>
        </div>
        <div>
          <dt>{'오른쪽 여백'}</dt>
          <dd>{g.wide ? g.start : g.end}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs/[1.7] text-neutral-500">
        {g.layout}
        {'. 짙은 세로 띠는 주 메뉴, 가로 띠는 헤더와 푸터입니다.'}
      </p>
    </div>
  );
}
