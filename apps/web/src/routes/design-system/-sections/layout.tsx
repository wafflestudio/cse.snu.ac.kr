import { useState } from 'react';

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
      <figcaption className="mb-2 text-sm text-neutral-500">{label}</figcaption>
      <div
        className="flex overflow-hidden border border-neutral-300"
        style={{ width: px(width), height: px(560) }}
      >
        {isDesktop && (
          <div className="shrink-0 bg-[#323235]" style={{ width: px(nav) }} />
        )}
        <div className="flex grow flex-col">
          <div
            className={isDesktop ? 'bg-neutral-900' : 'bg-[#2D2D30]'}
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
      <figcaption className="text-md font-medium">
        화면 폭에 따른 본문 영역과 읽기 폭
      </figcaption>
      <div className="mt-2 mb-2 flex gap-6 text-sm text-neutral-700">
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
        aria-label="1024px 미만은 영역과 읽기 폭이 같고 720px에서 멈춘다. 데스크톱의 영역은 1024px에서 724px, 1279px에서 979px, 1280px에서 720px, 이후 계속 늘어난다. 읽기 폭은 어디서나 720px을 넘지 않는다."
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
    </figure>
  );
}

const SAMPLE_TEXT =
  '컴퓨터공학부는 1975년 전자계산기공학과로 출발하여 지금까지 우리나라 컴퓨터 분야의 발전을 이끌어 왔습니다. 학부 과정에서는 컴퓨터 과학과 공학의 기초 이론부터 시스템, 인공지능, 응용에 이르는 폭넓은 교육을 제공하며, 대학원 과정에서는 세계적 수준의 연구를 수행하고 있습니다.';

function ReadingSamples() {
  return (
    <div className="space-y-6">
      <p className="font-medium">읽기 폭 견본(본문 14px, 줄높이 28px)</p>
      {[READING, 720, 880].map((w) => (
        <div key={w}>
          <p className="mb-1 text-sm text-neutral-500">
            {w}px · 한 줄 약 {w === 640 ? 62 : w === READING ? 70 : 85}자
            {w === READING ? ' — 제안' : ''}
          </p>
          <p
            className="border-l-2 border-neutral-200 pl-3 text-md leading-7"
            style={{ maxWidth: w }}
          >
            {SAMPLE_TEXT}
          </p>
        </div>
      ))}
    </div>
  );
}

function LayoutReasons() {
  return (
    <div>
      <p className="font-medium">근거</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          <b>읽기 폭 640</b> — 본문 14px에서 한 줄 약 62자(공백 포함, 실측)다.
          많이 읽히는 한국어 글 사이트가 58~69자에 모여 있다(브런치 59, 토스
          기술 블로그 58, 위키백과 63, KRDS 문서 65~69). 이전 이 사이트는
          880px에 약 89자였다.
        </li>
        <li>
          표·카드·달력처럼 넓을수록 좋은 것은 읽기 폭을 받지 않고 영역 전체를
          쓴다. 그래서 본문 영역에는 모바일·데스크톱 모두 상한을 두지 않는다.
          메인·카테고리처럼 배경 띠가 있는 화면도 끝까지 찬다.
        </li>
        <li>
          <b>1024</b> — 데스크톱 틀(왼쪽 내비 100 + 여백 100·100)을 써도 영역이
          724px로 읽기 폭보다 넓다. 태블릿 가로(1024~1180)와 작은 노트북 창이
          여기부터 데스크톱을 쓴다.
        </li>
        <li>
          <b>1280</b> — 서브내비 자리 360을 넣어도 영역이 720px 남는다. 1200이면
          640px로 표·카드가 읽기 폭까지 좁아진다. 1280에서 영역이 979→720px로
          줄어드는 것은 서브내비 자리가 한꺼번에 생기기 때문이다.
        </li>
      </ul>
    </div>
  );
}

export function LayoutSection() {
  return (
    <div className="space-y-8 text-md leading-7">
      <p className="text-sm text-neutral-500">
        도식은 실제 폭의 30%다. 옅은 상자가 본문 영역, 짙은 상자가 읽기 폭, 주황
        선이 서브내비다.
      </p>
      <div className="flex flex-wrap items-start gap-8">
        {FRAMES.map((frame) => (
          <LayoutDiagram key={frame.width} {...frame} />
        ))}
      </div>
      <table className="w-full max-w-3xl border-t border-neutral-200 text-left">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="py-2 font-medium">화면 폭</th>
            <th className="py-2 font-medium">배치</th>
            <th className="py-2 font-medium">본문 영역</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral-200">
            <td className="py-2">1024px 미만</td>
            <td className="py-2">모바일. 상단 바와 모바일 메뉴, 한 열</td>
            <td className="py-2">좌우 여백 20px, 상한 없음</td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="py-2">1024px 이상</td>
            <td className="py-2">데스크톱. 왼쪽 내비</td>
            <td className="py-2">좌우 여백 100px, 상한 없음</td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="py-2">1280px 이상</td>
            <td className="py-2">오른쪽에 서브내비가 나타난다</td>
            <td className="py-2">왼쪽 100px, 오른쪽 360px(서브내비 자리)</td>
          </tr>
        </tbody>
      </table>
      <WidthChart />
      <ReadingSamples />
      <LayoutReasons />
      <div>
        <p className="font-medium">쓰는 법</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            긴 문단은 <code>max-w-160</code>(640px)으로 감싼다. HTML 본문(
            <code>HTMLViewer</code>)은 문단·목록·제목이 자동으로 640px에서
            멈춘다. 표·카드 격자·달력·폼은 영역 전체를 쓴다.
          </li>
          <li>
            데스크톱 스타일은 <code>sm:</code>(1024px)로 쓴다. <code>xl:</code>
            (1280px)은 서브내비와 그 자리에만 쓴다. <code>md:</code>·
            <code>lg:</code>와 임의 브레이크포인트는 쓰지 않는다. 예외: 메인
            뉴스 캐러셀의 카드 수.
          </li>
          <li>
            본문 가로 여백은 <code>page-gutter-x</code>. 본문 밖 띠(제목
            영역·헤더·푸터)도 모바일에서는 <code>px-5</code>(20px).
          </li>
          <li>
            JS로 분기해야 하면 <code>useIsMobile()</code>(1024px 미만). 보이기만
            다른 분기는 CSS로 한다.
          </li>
          <li>공개 화면은 320px부터, 행정실 편집·관리는 1200px부터 맞춘다.</li>
        </ul>
      </div>
    </div>
  );
}
