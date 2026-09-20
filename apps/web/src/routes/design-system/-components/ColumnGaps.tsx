// 칸의 생김새가 간격을 정한다 — 붙어 있는 알약과 떨어져 있는 정사각 카드는 같은 값을 못 쓴다.
const ROWS = [
  { gap: 16, cards: 4, shape: 'h-9 flex-1', role: '촘촘한 선택 목록' },
  { gap: 32, cards: 3, shape: 'h-20 flex-1', role: '카드 격자' },
  { gap: 64, cards: 3, shape: 'size-18 shrink-0', role: '작은 정사각 카드' },
];

export function ColumnGaps() {
  return (
    <div className="max-w-[960px] bg-neutral-50 p-6 max-sm:p-4">
      {ROWS.map((row) => (
        <div key={row.gap} className="[&+&]:mt-8">
          <div className="mb-2 flex items-baseline gap-2 text-xs/[inherit]">
            <strong className="font-medium text-neutral-800">{row.gap}</strong>
            <span className="text-neutral-500">{row.role}</span>
          </div>
          {/* 좁은 화면에서 64 는 정사각 카드 셋을 못 담는다 — 이 문서가 말하는 대로
              줄이지 않고 그 안에서 옆으로 움직이게 둔다. */}
          <div className="overflow-x-auto">
            <div className="flex" style={{ gap: row.gap }}>
              {Array.from({ length: row.cards }, (_, index) => (
                <div
                  key={`${row.gap}-${index}`}
                  className={`min-w-0 bg-white ring-1 ring-neutral-200 ${row.shape}`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
