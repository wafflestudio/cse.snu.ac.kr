import Button from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';

const ROWS = [
  {
    token: 'rounded-control',
    px: '1px',
    role: '버튼 · 입력 · 드롭다운 · 검색 상자',
    sample: <Button variant="secondary">{'버튼'}</Button>,
  },
  {
    token: 'rounded-surface',
    px: '4px',
    role: '카드 · 지도 · 첨부 · 모달 · 검색 패널',
    sample: (
      <div className="rounded-surface grid h-8 w-24 place-items-center border border-neutral-200 bg-neutral-50 text-xs text-neutral-500">
        {'면'}
      </div>
    ),
  },
  {
    token: 'rounded-full',
    px: '전체',
    role: '태그 · 단일 선택 · 점 · 라디오',
    sample: <Tag label="태그" />,
  },
];

/** 값이 아니라 역할로 고른다는 걸 보이려면 세 역할을 한 줄에 놓아야 한다. */
export function RadiusRoles() {
  return (
    <div className="max-w-[720px] border border-neutral-200">
      <div className="grid grid-cols-[minmax(0,1fr)_120px_64px] items-center gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[11px] text-neutral-500 max-sm:grid-cols-[minmax(0,1fr)_88px]">
        <span>{'쓰는 곳'}</span>
        <span>{'토큰'}</span>
        <span className="max-sm:hidden">{'값'}</span>
      </div>
      {ROWS.map((row) => (
        <div
          key={row.token}
          className="grid grid-cols-[minmax(0,1fr)_120px_64px] items-center gap-4 px-5 py-4 text-xs/[inherit] text-neutral-600 [&~div]:border-t [&~div]:border-neutral-100 max-sm:grid-cols-[minmax(0,1fr)_88px]"
        >
          <span className="flex min-w-0 items-center gap-4">
            {row.sample}
            <span className="truncate max-sm:hidden">{row.role}</span>
          </span>
          <code className="text-neutral-500">{row.token}</code>
          <span className="max-sm:hidden">{row.px}</span>
        </div>
      ))}
    </div>
  );
}
