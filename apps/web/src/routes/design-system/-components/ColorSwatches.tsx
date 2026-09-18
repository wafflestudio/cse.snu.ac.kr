import { COLORS, luminance, SHELL } from '../-tokens';

export function BrandColors() {
  const roles = ['그래픽 · 강조 · 선택', '태그의 호버 상태', '본문 링크'];
  const names = ['주황색', '진한 주황색', '파란색'];
  return (
    <div className="grid w-[min(100%,560px)] grid-cols-3 gap-4 max-sm:grid-cols-1 max-sm:gap-0">
      {COLORS.slice(0, 3).map((color, index) => (
        <figure
          key={color.name}
          className="min-w-0 border-b border-neutral-200 max-sm:grid max-sm:grid-cols-[48px_minmax(0,1fr)] max-sm:items-start max-sm:gap-4 max-sm:py-3"
        >
          <span className={`block h-12 ${color.bg}`} />
          <figcaption className="flex flex-col py-3 [&_strong]:font-semibold [&>span]:mt-0.75 [&>span]:mb-2 [&>span]:text-xs/[inherit] [&>span]:text-neutral-500 [&_code]:text-neutral-700 max-sm:py-0">
            <strong>{names[index]}</strong>
            <span>{roles[index]}</span>
            <code>{color.hex.toUpperCase()}</code>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

type Swatch = { name: string; hex: string; bg: string };

function Ramp({ colors }: { colors: readonly Swatch[] }) {
  return (
    <div className="w-[min(100%,560px)] border border-neutral-200 [&_code]:text-[11px]">
      {colors.map((color) => (
        <div
          key={color.name}
          // 흰색과 neutral-950 중 대비가 높은 쪽. 0.1866 은 둘의 대비가 같아지는 밝기다.
          className={`flex items-center justify-between px-3 py-2 ${color.bg} ${
            luminance(color.hex) > 0.1866 ? 'text-neutral-950' : 'text-white'
          }`}
        >
          <code>{color.name}</code>
          <code>{color.hex.toUpperCase()}</code>
        </div>
      ))}
    </div>
  );
}

export function NeutralColors() {
  return <Ramp colors={COLORS.slice(3)} />;
}

export function ShellColors() {
  return <Ramp colors={SHELL} />;
}
