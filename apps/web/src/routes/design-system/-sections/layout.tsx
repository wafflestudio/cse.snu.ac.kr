import { useState } from 'react';
import {
  DocSection,
  DoDont,
  Lead,
  Related,
  RuleList,
  SpecTable,
} from '../-components/doc';

// 레이아웃 도식의 축척. 실제 px 에 곱해 그린다.
const SCALE = 0.3;
const px = (value: number) => `${value * SCALE}px`;

// 읽기 폭: 문단·HTML 본문의 한 줄 상한(14px 본문 실측 약 62자, 공백 포함).
const READING = 640;

// 화면 폭 → 본문 영역 폭. 모바일은 여백 20, 데스크톱은 여백 100(서브내비가 있으면 오른쪽 360). 상한은 없다.
function areaWidth(viewport: number) {
  if (viewport < 1024) return viewport - 40;
  if (viewport < 1280) return viewport - 300;
  return viewport - 560;
}
const readingWidth = (viewport: number) =>
  Math.min(areaWidth(viewport), READING);

type Frame = { width: number; label: string };
const FRAMES: Frame[] = [
  { width: 390, label: '390 — 휴대폰' },
  { width: 820, label: '820 — 태블릿 세로' },
  { width: 1100, label: '1100 — 태블릿 가로·작은 노트북' },
  { width: 1440, label: '1440 — 데스크톱' },
];

function LayoutDiagram({ width, label }: Frame) {
  const isDesktop = width >= 1024;
  const hasSubNav = width >= 1280;
  const nav = isDesktop ? 100 : 0;
  const area = areaWidth(width);
  const reading = readingWidth(width);
  const left = isDesktop ? 100 : (width - area) / 2;

  return (
    <figure>
      <figcaption className="mb-2 type-meta text-neutral-500">
        {label}
      </figcaption>
      <div
        className="flex overflow-hidden border border-neutral-300"
        style={{ width: px(width), height: px(560) }}
      >
        {isDesktop && (
          <div className="shrink-0 bg-neutral-850" style={{ width: px(nav) }} />
        )}
        <div className="flex grow flex-col">
          <div
            className={isDesktop ? 'bg-neutral-900' : 'bg-chrome-bar'}
            style={{ height: px(isDesktop ? 120 : 68) }}
          />
          <div className="bg-neutral-900" style={{ height: px(110) }} />
          <div className="relative flex grow bg-white">
            <div style={{ width: px(left) }} />
            <div
              className="flex flex-col gap-1 bg-neutral-100 p-1"
              style={{ width: px(area) }}
            >
              <span className="text-xs text-neutral-700">영역 {area}</span>
              <div
                className="flex flex-col bg-neutral-300 p-1"
                style={{ width: px(reading - 26) }}
              >
                <span className="text-xs text-neutral-800">읽기 {reading}</span>
              </div>
            </div>
            {hasSubNav && (
              <div
                className="absolute top-2 border-l-2 border-main-orange"
                style={{ right: px(80), height: px(200) }}
              />
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}

const CHART = { w: 640, h: 260, left: 44, right: 16, top: 16, bottom: 32 };
const X_MIN = 320;
const X_MAX = 1600;
const Y_MAX = 1100;
const xOf = (v: number) =>
  CHART.left +
  ((v - X_MIN) / (X_MAX - X_MIN)) * (CHART.w - CHART.left - CHART.right);
const yOf = (v: number) =>
  CHART.top + (1 - v / Y_MAX) * (CHART.h - CHART.top - CHART.bottom);

// 구간마다 따로 그려 경계의 끊김을 그대로 보인다.
function linePoints(fn: (v: number) => number) {
  return [
    [X_MIN, 1023],
    [1024, 1279],
    [1280, X_MAX],
  ].map(([from, to]) => {
    const points: string[] = [];
    for (let v = from; v <= to; v += 4) points.push(`${xOf(v)},${yOf(fn(v))}`);
    points.push(`${xOf(to)},${yOf(fn(to))}`);
    return points.join(' ');
  });
}

function WidthChart() {
  const [hover, setHover] = useState<number | null>(null);
  const series = [
    { name: '본문 영역', fn: areaWidth, className: 'stroke-neutral-800' },
    { name: '읽기 폭', fn: readingWidth, className: 'stroke-main-orange' },
  ];

  return (
    <figure className="max-w-3xl">
      <div className="mb-2 flex gap-6 type-meta text-neutral-700">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-2">
            <svg width="20" height="4" aria-hidden="true">
              <line
                x1="0"
                x2="20"
                y1="2"
                y2="2"
                strokeWidth={2}
                className={s.className}
              />
            </svg>
            {s.name}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${CHART.w} ${CHART.h}`}
        className="w-full"
        role="img"
        aria-label="본문 영역은 모바일에서 화면 폭보다 40px 좁고, 데스크톱은 1024px에서 724px, 1279px에서 979px, 1280px에서 720px이며 이후 계속 늘어난다. 읽기 폭은 영역을 따르다 640px에서 멈춘다."
        onMouseMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - box.left) / box.width) * CHART.w;
          const v = Math.round(
            X_MIN +
              ((x - CHART.left) / (CHART.w - CHART.left - CHART.right)) *
                (X_MAX - X_MIN),
          );
          setHover(v >= X_MIN && v <= X_MAX ? v : null);
        }}
        onMouseLeave={() => setHover(null)}
      >
        {[0, 360, 720, 1080].map((v) => (
          <g key={v}>
            <line
              x1={CHART.left}
              x2={CHART.w - CHART.right}
              y1={yOf(v)}
              y2={yOf(v)}
              className="stroke-neutral-200"
            />
            <text
              x={CHART.left - 6}
              y={yOf(v) + 4}
              textAnchor="end"
              className="fill-neutral-500 text-xs"
            >
              {v}
            </text>
          </g>
        ))}
        {[320, 760, 1024, 1280, 1600].map((v) => (
          <text
            key={v}
            x={xOf(v)}
            y={CHART.h - 10}
            textAnchor="middle"
            className="fill-neutral-500 text-xs"
          >
            {v}
          </text>
        ))}
        {[1024, 1280].map((v) => (
          <line
            key={v}
            x1={xOf(v)}
            x2={xOf(v)}
            y1={CHART.top}
            y2={CHART.h - CHART.bottom}
            strokeDasharray="3 3"
            className="stroke-neutral-400"
          />
        ))}
        {series.map((s) =>
          linePoints(s.fn).map((points, i) => (
            <polyline
              key={`${s.name}-${i}`}
              points={points}
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              className={s.className}
            />
          )),
        )}
        {hover !== null && (
          <g>
            <line
              x1={xOf(hover)}
              x2={xOf(hover)}
              y1={CHART.top}
              y2={CHART.h - CHART.bottom}
              className="stroke-neutral-300"
            />
            <text
              x={Math.min(xOf(hover) + 6, CHART.w - 190)}
              y={CHART.top + 12}
              className="fill-neutral-950 text-xs"
            >
              화면 {hover} → 영역 {Math.round(areaWidth(hover))} · 읽기{' '}
              {Math.round(readingWidth(hover))}
            </text>
          </g>
        )}
      </svg>
      <figcaption className="mt-2 type-meta text-neutral-500">
        화면 폭에 따른 본문 영역과 읽기 폭. 1280에서 영역이 979→720으로 줄어드는
        것은 서브내비 자리(360)가 한꺼번에 생기기 때문이다.
      </figcaption>
    </figure>
  );
}

const SAMPLE_TEXT =
  '컴퓨터공학부는 1975년 전자계산기공학과로 출발하여 지금까지 우리나라 컴퓨터 분야의 발전을 이끌어 왔습니다. 학부 과정에서는 컴퓨터 과학과 공학의 기초 이론부터 시스템, 인공지능, 응용에 이르는 폭넓은 교육을 제공하며, 대학원 과정에서는 세계적 수준의 연구를 수행하고 있습니다.';

function ReadingSample() {
  return (
    <figure>
      <p
        className="border-l-2 border-neutral-200 pl-3 type-body"
        style={{ maxWidth: READING }}
      >
        {SAMPLE_TEXT}
      </p>
      <figcaption className="mt-2 type-meta text-neutral-500">
        읽기 폭 {READING}px — 본문 14px에서 한 줄 약 62자.
      </figcaption>
    </figure>
  );
}

// 이렇게·하지 않는다 도식: 넓은 영역 안의 문단(회색 줄)과 표(칸).
function Lines({ full }: { full?: boolean }) {
  return (
    <div className="w-full space-y-1.5 border border-neutral-200 bg-neutral-50 p-2">
      <div className="space-y-1.5" style={{ width: full ? '100%' : '58%' }}>
        {[100, 100, 100, 70].map((w, i) => (
          <div
            key={i}
            className="h-1.5 bg-neutral-300"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-px bg-neutral-200 pt-px">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-3 bg-white" />
        ))}
      </div>
    </div>
  );
}

export function LayoutSection() {
  return (
    <>
      <Lead>
        화면은 1024px을 경계로 모바일과 데스크톱 두 틀을 쓰고, 1280px부터
        오른쪽에 서브내비가 붙는다. 본문 영역에는 상한이 없다 — 표·카드는 영역을
        다 쓰고, 긴 문단만 읽기 폭 640px에서 멈춘다.
      </Lead>

      <DocSection title="값">
        <SpecTable
          head={['화면 폭(px)', '본문 여백', '배치']}
          rows={[
            ['1024 미만', '좌우 20', '모바일 — 상단 바·모바일 메뉴, 한 열'],
            ['1024 이상', '좌우 100', '데스크톱 — 왼쪽 내비'],
            [
              '1280 이상',
              '왼 100 · 오른 360',
              '오른쪽에 서브내비(오른쪽 360이 그 자리)',
            ],
            ['읽기 폭', '640', '긴 문단·HTML 본문의 한 줄 상한'],
          ]}
        />
        <figure>
          <div className="overflow-x-auto">
            <div className="flex w-max flex-wrap items-start gap-8 sm:w-auto">
              {FRAMES.map((frame) => (
                <LayoutDiagram key={frame.width} {...frame} />
              ))}
            </div>
          </div>
          <figcaption className="mt-2 type-meta text-neutral-500">
            실제 폭의 30%. 옅은 상자가 본문 영역, 짙은 상자가 읽기 폭, 주황 선이
            서브내비다.
          </figcaption>
        </figure>
        <WidthChart />
        <ReadingSample />
      </DocSection>

      <DocSection title="쓰는 법">
        <RuleList
          items={[
            '긴 문단은 읽기 폭(max-w-160, 640px)으로 감싼다. HTML 본문은 문단·목록·제목이 스스로 640px에서 멈춘다.',
            '표·카드 격자·달력·폼은 읽기 폭을 받지 않고 영역 전체를 쓴다. 배경 띠가 있는 메인·카테고리도 끝까지 찬다.',
            '데스크톱 모양은 sm:(1024px)로 쓴다. xl:(1280px)은 서브내비와 그 자리에만 쓴다.',
            'md:·lg:와 임의 브레이크포인트는 쓰지 않는다. 예외는 메인 뉴스 캐러셀의 카드 수 하나다.',
            'JS로 갈라야 할 때만 useIsMobile()(1024px 미만)을 쓴다. 보이기만 다른 분기는 CSS로 한다.',
            '공개 화면은 320px부터, 행정실 편집·관리 화면은 1200px부터 맞춘다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: <Lines />,
            caption: '문단은 640px에서 멈추고, 표는 영역을 다 쓴다.',
          }}
          bad={{
            example: <Lines full />,
            caption:
              '문단을 영역 끝까지 늘린다 — 한 줄이 너무 길어 읽기 어렵다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['page', '페이지 틀'],
            ['navigation', '내비게이션·셸'],
            ['spacing', '간격'],
            ['reading', '읽는 본문·이미지'],
          ]}
        />
      </DocSection>
    </>
  );
}
