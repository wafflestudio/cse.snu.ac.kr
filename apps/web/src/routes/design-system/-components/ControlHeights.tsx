import { Fragment, useState } from 'react';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import { Tag } from '@/components/ui/Tag';

const ROWS = [
  { name: 'min-h-7', px: 28, role: '태그 · 작은 버튼 · 목록 항목' },
  { name: 'min-h-8', px: 32, role: '버튼 · 입력 · 드롭다운 · 날짜 — 기본' },
  { name: 'min-h-10', px: 40, role: '큰 버튼' },
];

/** 값을 적는 것만으로는 「같은 줄에서 높이가 맞는다」가 안 보인다 — 진짜 컨트롤을 한 줄에 둔다. */
export function ControlHeights() {
  const [sort, setSort] = useState('최신순');
  return (
    <div className="max-w-[720px]">
      <dl className="mb-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4">
        {ROWS.map((row) => (
          <Fragment key={row.name}>
            <dt className="py-0.5 [&_code]:text-neutral-500">
              <code>{row.name}</code>
              <span className="ml-2 text-xs text-neutral-400">{row.px}</span>
            </dt>
            <dd className="py-0.5 text-sm/[1.6] text-neutral-600">
              {row.role}
            </dd>
          </Fragment>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-5 border border-neutral-200 px-5 py-6">
        <Button variant="primary" size="sm">
          {'작게'}
        </Button>
        <Button variant="primary" size="md">
          {'기본'}
        </Button>
        <Button variant="secondary" size="md">
          {'테두리'}
        </Button>
        <Button variant="primary" size="lg">
          {'크게'}
        </Button>
        <Tag label="태그" />
        <Dropdown
          contents={['최신순', '오래된순']}
          selectedIndex={sort === '최신순' ? 0 : 1}
          onClick={(i) => setSort(i === 0 ? '최신순' : '오래된순')}
        />
      </div>
    </div>
  );
}
