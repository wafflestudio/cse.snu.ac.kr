import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';

const VALUES = {
  desktop: { title: 44, section: 88, band: 64, bottom: 150 },
  mobile: { title: 28, section: 64, band: 48, bottom: 64 },
};

function Measure({ px, scale }: { px: number; scale: number }) {
  return (
    <div
      className="relative flex items-center justify-center border-y border-dashed border-neutral-300 text-[10px] text-neutral-500"
      style={{ height: px * scale }}
    >
      {px}
    </div>
  );
}

export function VerticalRhythm() {
  const [mobile, setMobile] = useState(false);
  const v = mobile ? VALUES.mobile : VALUES.desktop;
  const scale = 0.5;

  return (
    <div className="max-w-[960px] [&>fieldset]:mb-6">
      <SegmentedControl
        name="vertical-rhythm-mode"
        label={'화면'}
        value={mobile}
        onChange={setMobile}
        options={[
          { value: false, label: '데스크톱' },
          { value: true, label: '모바일' },
        ]}
      />
      <div className="bg-neutral-50 p-6 max-sm:p-4">
        <div className="mx-auto max-w-115 bg-white ring-1 ring-neutral-200">
          <div className="grid h-10 place-items-center bg-neutral-900 text-[11px] text-neutral-300">
            {'페이지 제목'}
          </div>
          <Measure px={v.title} scale={scale} />
          <Block label="본문 첫 단락" />
          <Measure px={v.section} scale={scale} />
          {/* 면이 있는 섹션은 가장자리에서 내용까지가 따로 있다. */}
          <div className="bg-neutral-100">
            <Measure px={v.band} scale={scale} />
            <Block label="띠 안의 내용" />
            <Measure px={v.band} scale={scale} />
          </div>
          <Measure px={v.bottom} scale={scale} />
          <div className="grid h-10 place-items-center bg-neutral-800 text-[11px] text-neutral-300">
            {'푸터'}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs/[1.7] text-neutral-500">
        {'세로 축척 1:2. 회색 띠는 배경이 있는 섹션이다.'}
      </p>
    </div>
  );
}

function Block({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2 px-5 py-4 text-[11px] text-neutral-500">
      {label}
      <i className="block h-1.5 bg-neutral-200" />
      <i className="block h-1.5 w-4/5 bg-neutral-200" />
    </div>
  );
}
