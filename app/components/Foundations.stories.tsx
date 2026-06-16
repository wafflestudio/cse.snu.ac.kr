import type { Meta, StoryObj } from '@storybook/tanstack-react';

// 디자인 토큰(app/app.css의 @theme)과 레이아웃 규약을 Storybook에 노출하는 문서용 스토리.
// 토큰 값이 바뀌면 이 스와치가 자동으로 따라간다(같은 Tailwind 클래스를 쓰므로).
const meta = {
  title: 'Foundations/Design Tokens',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;

function Swatch({
  cls,
  name,
  hex,
}: {
  cls: string;
  name: string;
  hex: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`h-14 w-full rounded border border-neutral-200 ${cls}`} />
      <div className="text-sm font-medium text-neutral-800">{name}</div>
      <div className="font-mono text-xs text-neutral-500">{hex}</div>
    </div>
  );
}

const BRAND = [
  { name: 'main-orange', cls: 'bg-main-orange', hex: '#ff6914' },
  { name: 'main-orange-dark', cls: 'bg-main-orange-dark', hex: '#e65817' },
  { name: 'link', cls: 'bg-link', hex: '#3c7be4' },
  { name: 'visited', cls: 'bg-visited', hex: '#ff0000' },
];

const NEUTRAL = [
  ['neutral-50', 'bg-neutral-50', '#fafafa'],
  ['neutral-75', 'bg-neutral-75', '#f8f8f8'],
  ['neutral-100', 'bg-neutral-100', '#f5f5f5'],
  ['neutral-200', 'bg-neutral-200', '#e5e5e5'],
  ['neutral-300', 'bg-neutral-300', '#d4d4d4'],
  ['neutral-400', 'bg-neutral-400', '#a3a3a3'],
  ['neutral-500', 'bg-neutral-500', '#737373'],
  ['neutral-600', 'bg-neutral-600', '#525252'],
  ['neutral-700', 'bg-neutral-700', '#404040'],
  ['neutral-800', 'bg-neutral-800', '#262626'],
  ['neutral-850', 'bg-neutral-850', '#1e1e1e'],
  ['neutral-900', 'bg-neutral-900', '#171717'],
  ['neutral-950', 'bg-neutral-950', '#0a0a0a'],
] as const;

export const Colors: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">Brand</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BRAND.map((c) => (
            <Swatch key={c.name} {...c} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">Neutral</h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-7">
          {NEUTRAL.map(([name, cls, hex]) => (
            <Swatch key={name} name={name} cls={cls} hex={hex} />
          ))}
        </div>
      </section>
    </div>
  ),
};

/** 페이지 본문 가로 여백 규약 `.page-gutter-x`. 좌/우 거터를 실제 비율로 시각화. */
export const PageGutter: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-6 p-8">
      <div>
        <h2 className="mb-1 text-lg font-semibold text-neutral-900">
          page-gutter-x — 페이지 본문 가로 여백
        </h2>
        <p className="text-sm leading-6 text-neutral-600">
          페이지 본문 좌우 여백의 <strong>단일 출처</strong>(app.css의 utility).
          <code className="mx-1 rounded bg-neutral-100 px-1 font-mono text-xs">
            PageLayout
          </code>
          ·
          <code className="mx-1 rounded bg-neutral-100 px-1 font-mono text-xs">
            ContentSection
          </code>
          이 이 클래스를 쓰고, 개별 페이지에서 패딩(
          <code className="font-mono text-xs">px-…</code>)을 인라인으로
          재선언하지 않는다. 우측이 큰 건 <strong>SubNavbar(목차) 자리</strong>
          를 비워두기 때문.
        </p>
      </div>

      {/* 데스크톱: 실제 px를 그대로 폭으로 그려 비율을 보여준다 (w-25=100px, w-90=360px) */}
      <div>
        <div className="mb-1.5 text-xs font-medium text-neutral-500">
          데스크톱 (sm 이상)
        </div>
        <div className="flex items-stretch overflow-hidden rounded border border-neutral-300 text-center text-xs">
          <div className="flex w-25 shrink-0 items-center justify-center bg-main-orange/15 py-7 font-medium text-main-orange-dark">
            좌 100px
          </div>
          <div className="flex flex-1 items-center justify-center bg-white py-7 text-neutral-700">
            본문 콘텐츠
          </div>
          <div className="flex w-90 shrink-0 items-center justify-center bg-main-orange/15 py-7 font-medium leading-tight text-main-orange-dark">
            우 360px
            <br />
            (SubNavbar 자리)
          </div>
        </div>
      </div>

      {/* 모바일 */}
      <div>
        <div className="mb-1.5 text-xs font-medium text-neutral-500">
          모바일 (sm 미만) — 좌우 각 20px
        </div>
        <div className="flex w-[280px] items-stretch overflow-hidden rounded border border-neutral-300 text-center text-[10px]">
          <div className="flex w-5 shrink-0 items-center justify-center bg-main-orange/15 text-main-orange-dark">
            20
          </div>
          <div className="flex flex-1 items-center justify-center bg-white py-7 text-xs text-neutral-700">
            본문
          </div>
          <div className="flex w-5 shrink-0 items-center justify-center bg-main-orange/15 text-main-orange-dark">
            20
          </div>
        </div>
      </div>
    </div>
  ),
};
