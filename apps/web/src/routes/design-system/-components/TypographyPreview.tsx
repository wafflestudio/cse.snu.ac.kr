import { TYPE_SCALE } from '../-tokens';

const SAMPLE = '컴퓨터 기술의 진화를 선도합니다.';

export function TypographyPreview() {
  return (
    <div className="max-w-[960px] border border-neutral-200">
      <div className="grid grid-cols-[64px_76px_minmax(0,1fr)] items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[11px] text-neutral-500 max-sm:grid-cols-2 max-sm:gap-x-3 max-sm:gap-y-2 max-sm:p-4 max-sm:[&>span:last-child]:hidden">
        <span>{'토큰'}</span>
        <span>{'크기 · 행간'}</span>
        <span>{'쓰는 곳'}</span>
      </div>
      {TYPE_SCALE.map((token) => (
        <div
          className="grid grid-cols-[64px_76px_minmax(0,1fr)] items-baseline gap-3 px-5 py-4 [&~div]:border-t [&~div]:border-neutral-100 [&>span]:text-xs/[inherit] [&>span]:text-neutral-600 max-sm:grid-cols-2 max-sm:gap-x-3 max-sm:gap-y-2 max-sm:p-4"
          key={token.name}
        >
          <span className="text-neutral-500">
            <code>{token.name}</code>
          </span>
          <span className="tabular-nums">
            {token.px}px · {token.leading}
          </span>
          <span className="max-sm:col-span-full">{token.role}</span>
          <p
            className={`col-span-full mt-2 break-keep text-neutral-900 ${token.className}`}
          >
            {SAMPLE}
          </p>
        </div>
      ))}
    </div>
  );
}
