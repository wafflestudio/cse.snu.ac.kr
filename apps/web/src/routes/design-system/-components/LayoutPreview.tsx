import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';

export function LayoutPreview() {
  const [mobile, setMobile] = useState(false);
  const values = mobile
    ? ['20px', '20px', '28px', '64px']
    : ['100px', '360px', '44px', '150px'];
  return (
    <div className="max-w-[960px] [&>fieldset]:mb-6">
      <SegmentedControl
        name="layout-mode"
        label={'화면'}
        value={mobile}
        onChange={setMobile}
        options={[
          { value: false, label: '데스크톱' },
          { value: true, label: '모바일' },
        ]}
      />
      <div className="grid min-h-75 place-items-center bg-neutral-100 p-7 max-sm:min-h-70 max-sm:px-2.5 max-sm:py-4.5">
        <div
          className={`grid overflow-hidden border border-neutral-300 text-[11px] ${mobile ? 'w-60 max-w-full grid-cols-1 grid-rows-[35px_65px_140px]' : 'w-full max-w-170 grid-cols-[56px_minmax(0,1fr)] grid-rows-[90px_150px] max-sm:grid-cols-[30px_minmax(0,1fr)]'}`}
        >
          <div
            className={`flex items-start bg-neutral-700 text-neutral-200 ${mobile ? 'justify-start p-2' : 'row-span-2 justify-center pt-6.25 [writing-mode:vertical-rl]'}`}
          >
            {'탐색'}
          </div>
          <div
            className={`bg-neutral-900 text-white [&>span]:block [&>span]:text-[9px] [&>span]:text-neutral-400 [&_strong]:text-[15px] [&_strong]:font-medium ${mobile ? 'px-4.5 py-2.5 [&>span]:mb-0.75' : 'px-6.5 py-4.25 [&>span]:mb-2.5 max-sm:pl-3.75'}`}
          >
            <span>SNU CSE</span>
            <strong>{'페이지 제목'}</strong>
          </div>
          <div
            className={`grid bg-white ${mobile ? 'grid-cols-[33px_minmax(0,1fr)_33px]' : 'grid-cols-[1fr_3fr_2fr] max-sm:grid-cols-[34px_minmax(0,1fr)_56px]'}`}
          >
            <span className="grid place-items-center border border-dashed border-neutral-300 bg-neutral-50 text-[10px] text-neutral-500">
              {values[0]}
            </span>
            <div className="flex min-w-0 flex-col justify-center gap-2.5 p-3.75 [&_strong]:mb-1.25 [&_strong]:font-medium [&_i]:block [&_i]:h-1.25 [&_i]:bg-neutral-200 [&_i:last-child]:w-3/5 max-sm:p-2.5">
              <strong>{'본문'}</strong>
              <i />
              <i />
              <i />
            </div>
            <span className="grid place-items-center border border-dashed border-neutral-300 bg-neutral-50 text-[10px] text-neutral-500">
              {values[1]}
            </span>
          </div>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-4 border-y border-neutral-200 py-5 [&_div+div]:border-l [&_div+div]:border-neutral-200 [&_div+div]:pl-5 [&_dt]:text-xs/[inherit] [&_dt]:text-neutral-500 [&_dd]:mt-1.5 [&_dd]:text-xl/[inherit] [&_dd]:font-medium max-sm:grid-cols-2 max-sm:gap-5 max-sm:[&_div:nth-child(3)]:border-l-0 max-sm:[&_div:nth-child(3)]:pl-0 max-sm:[&_dd]:text-[20px]">
        {['본문 왼쪽', '본문 오른쪽', '본문 위쪽', '본문 아래쪽'].map(
          (label, index) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{values[index]}</dd>
            </div>
          ),
        )}
      </dl>
      <p className="mt-3 block text-xs/[1.7] text-neutral-500">
        {'표준 콘텐츠 페이지의 여백. 도식은 실제 화면 축척과 다릅니다.'}
      </p>
    </div>
  );
}
