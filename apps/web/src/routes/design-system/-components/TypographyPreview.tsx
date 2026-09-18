import { useState } from 'react';
import { TYPE_SCALE } from '../-tokens';
import { SegmentedControl } from './SegmentedControl';

export function TypographyPreview() {
  const [sample, setSample] = useState('');
  const [weight, setWeight] = useState('font-normal');
  const roles = [
    '페이지 제목',
    '영역 제목',
    '강조 제목',
    '소제목',
    '본문',
    '입력과 목록',
    '보조 정보',
    '작은 레이블',
  ];
  return (
    <div className="max-w-[960px] border border-neutral-200">
      <div className="flex flex-wrap items-end gap-5 border-b border-neutral-200 bg-neutral-50 p-5 max-sm:gap-4 max-sm:p-4">
        <label className="flex min-w-[130px] flex-1 flex-col gap-2 max-sm:basis-full">
          <span className="text-xs/[inherit] font-medium text-neutral-600">
            {'문구'}
          </span>
          <input
            className="h-10 w-full min-w-0 rounded-[2px] border border-neutral-300 bg-white px-3 text-sm/[inherit] placeholder:text-neutral-500"
            value={sample}
            maxLength={120}
            onChange={(event) => setSample(event.target.value)}
            placeholder={'컴퓨터 기술의 진화를 선도합니다.'}
          />
        </label>
        <SegmentedControl
          name="type-weight"
          label={'굵기'}
          value={weight}
          onChange={setWeight}
          options={[
            { value: 'font-normal', label: 'Regular' },
            { value: 'font-medium', label: 'Medium' },
            { value: 'font-semibold', label: 'Semibold' },
          ]}
        />
      </div>
      <div>
        <div className="grid grid-cols-[105px_58px_minmax(0,1fr)] items-center gap-3 border-b border-neutral-200 px-5 py-3 text-[11px] text-neutral-500 max-sm:grid-cols-2 max-sm:gap-x-3 max-sm:gap-y-2 max-sm:p-4 max-sm:[&>span:last-child]:hidden">
          <span>{'적용 예'}</span>
          <span>{'크기'}</span>
          <span>{'서체'}</span>
        </div>
        {TYPE_SCALE.map((token, index) => (
          <div
            className="grid min-h-19.5 grid-cols-[105px_58px_minmax(0,1fr)] items-center gap-3 px-5 py-4 [&~div]:border-t [&~div]:border-neutral-100 [&>span]:text-xs/[inherit] [&>span]:text-neutral-600 [&>p]:leading-[1.4] max-sm:min-h-27.5 max-sm:grid-cols-2 max-sm:gap-x-3 max-sm:gap-y-2 max-sm:p-4 max-sm:[&>p]:col-span-full max-sm:[&>p]:mt-2"
            key={token.name}
          >
            <span>{roles[index]}</span>
            <span className="tabular-nums">{token.px}px</span>
            <p className={`${token.className} ${weight}`}>
              {sample || '컴퓨터 기술의 진화를 선도합니다.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
