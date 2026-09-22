const ROWS = [
  {
    token: 'shadow-overlay',
    role: '대화상자 · 경고 대화상자 · 이미지 팝업 · 드롭다운 목록 · 달력',
    box: 'shadow-overlay bg-white',
  },
];

/** 그림자는 값이 아니라 「어디에 떠 있나」로 고른다. */
export function ShadowRoles() {
  return (
    <div className="max-w-[720px] border border-neutral-200">
      <div className="grid grid-cols-[112px_minmax(0,1fr)_150px] items-center gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[11px] text-neutral-500 max-sm:grid-cols-[88px_minmax(0,1fr)]">
        <span>{'견본'}</span>
        <span>{'쓰는 곳'}</span>
        <span className="max-sm:hidden">{'토큰'}</span>
      </div>
      {ROWS.map((row) => (
        <div
          key={row.token}
          className="grid grid-cols-[112px_minmax(0,1fr)_150px] items-center gap-4 px-5 py-5 text-xs/[1.6] text-neutral-600 [&~div]:border-t [&~div]:border-neutral-100 max-sm:grid-cols-[88px_minmax(0,1fr)]"
        >
          <span className={`block h-10 w-full ${row.box}`} />
          <span className="min-w-0">{row.role}</span>
          <code className="text-neutral-500 max-sm:hidden">{row.token}</code>
        </div>
      ))}
    </div>
  );
}
