// 메인 상단 도형 그래픽. 원래 단일 래스터(mainGraphic.avif)였으나, 도형별 호버
// 인터랙션(개별 scale)을 주려고 동일한 격자를 인라인 SVG로 재구성했다.
// 좌표·색은 원본 avif에서 픽셀 추출(원 지름 40 / 사각형 25×50, 열 피치 108·행 피치 88).
type Cell = { s: 'c' | 'r'; c: string } | null;

const COLS = [27, 135, 243, 351, 459, 567, 675, 783, 891, 999];
const ROWS = [25, 113, 201, 289, 377, 465];

const GRID: Cell[][] = [
  [
    null,
    { s: 'c', c: '#e65015' },
    { s: 'r', c: '#ea751b' },
    { s: 'c', c: '#e25716' },
    { s: 'r', c: '#ea6c1a' },
    { s: 'c', c: '#e9521b' },
    { s: 'c', c: '#e05115' },
    { s: 'r', c: '#e97517' },
    { s: 'r', c: '#ea651a' },
    null,
  ],
  [
    null,
    null,
    { s: 'c', c: '#ea5918' },
    { s: 'r', c: '#ea401e' },
    { s: 'c', c: '#e77316' },
    { s: 'c', c: '#ea471c' },
    { s: 'r', c: '#de4916' },
    { s: 'r', c: '#ea591a' },
    { s: 'r', c: '#e95118' },
    { s: 'c', c: '#e96e1a' },
  ],
  [
    { s: 'c', c: '#dd3516' },
    { s: 'r', c: '#e85017' },
    { s: 'c', c: '#e65317' },
    { s: 'r', c: '#e55b15' },
    { s: 'c', c: '#e36415' },
    { s: 'r', c: '#d74d14' },
    { s: 'c', c: '#e14816' },
    { s: 'r', c: '#e86316' },
    null,
    null,
  ],
  [
    null,
    { s: 'c', c: '#e95616' },
    { s: 'r', c: '#e96719' },
    { s: 'c', c: '#e34615' },
    { s: 'c', c: '#e9571c' },
    { s: 'c', c: '#e96e18' },
    { s: 'c', c: '#e95817' },
    { s: 'r', c: '#d82d14' },
    { s: 'r', c: '#e85217' },
    null,
  ],
  [
    null,
    null,
    { s: 'c', c: '#e65814' },
    { s: 'r', c: '#e84917' },
    { s: 'c', c: '#e25c15' },
    { s: 'r', c: '#e95a1d' },
    { s: 'c', c: '#ea5620' },
    { s: 'c', c: '#ea621c' },
    { s: 'r', c: '#e84615' },
    { s: 'r', c: '#e16515' },
  ],
  [
    null,
    { s: 'c', c: '#e14115' },
    { s: 'r', c: '#e14d15' },
    { s: 'c', c: '#ea4922' },
    { s: 'c', c: '#da5a15' },
    { s: 'c', c: '#e55e16' },
    { s: 'r', c: '#e95618' },
    { s: 'c', c: '#ea7d1a' },
    { s: 'r', c: '#ea8020' },
    null,
  ],
];

// transform-box:fill-box → 변환 원점(origin-center)이 SVG 캔버스가 아니라 각 도형의
// 바운딩박스 중심이 되어, 도형이 제자리에서 커진다. 호버 판정은 그룹 단위(group-hover)라
// 도형 위가 아니라 아래의 투명 히트영역에 올라가도 커진다.
const SHAPE_CLASS =
  'origin-center [transform-box:fill-box] transition-transform duration-100 ease-out group-hover:scale-125';

// 보이지 않는 히트영역(셀 피치 108×88보다 약간 작게)으로 도형보다 넓게 호버를 잡는다.
// fill=transparent라 렌더 픽셀은 변하지 않는다.
const HIT_W = 96;
const HIT_H = 80;

export default function MainGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1025 493"
      className={className}
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {GRID.flatMap((row, r) =>
        row.map((cell, c) => {
          if (!cell) return null;
          const cx = COLS[c];
          const cy = ROWS[r];
          const key = `${r}-${c}`;
          return (
            <g key={key} className="group">
              <rect
                x={cx - HIT_W / 2}
                y={cy - HIT_H / 2}
                width={HIT_W}
                height={HIT_H}
                fill="transparent"
              />
              {cell.s === 'c' ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r={20}
                  fill={cell.c}
                  className={SHAPE_CLASS}
                />
              ) : (
                <rect
                  x={cx - 12.5}
                  y={cy - 25}
                  width={25}
                  height={50}
                  fill={cell.c}
                  className={SHAPE_CLASS}
                />
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
}
