import { useState } from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import EmptyState from '@/components/ui/EmptyState';
import { useLanguage } from '@/hooks/useLanguage';
import type { YearStat } from '@/types/api';

const CAREER_STAT_ROWS = [
  '삼성',
  'LG',
  '기타 대기업',
  '중소기업',
  '진학',
  '기타',
];
const CAREER_STAT_COLS = ['학부', '석사', '박사'];

export default function CareerStat({ stat }: { stat: YearStat[] }) {
  const [idx, setIdx] = useState(0);
  const { t, localizedPath } = useLanguage({
    '졸업생 진로 현황': 'Career Path Statistics',
  });

  const year = stat[idx].year;
  const yearStat = stat.find((x) => x.year === year);

  if (!yearStat) return <EmptyState>선택한 연도의 자료가 없습니다.</EmptyState>;

  return (
    <div className="mt-12 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:w-[432px]">
        <div className="flex items-center gap-2">
          <h3 className="type-item">{t('졸업생 진로 현황')}</h3>
          <Dropdown
            contents={stat.map((x) => x.year.toString())}
            selectedIndex={idx}
            onClick={setIdx}
          />
        </div>
        <LoginVisible allow="ROLE_STAFF">
          <div className="ml-auto flex gap-3">
            <Button
              as="link"
              to={localizedPath(`/about/future-careers/stat/edit?year=${year}`)}
              variant="secondary"
              size="md"
            >
              편집
            </Button>
            <Button
              as="link"
              to={localizedPath('/about/future-careers/stat/create')}
              variant="primary"
              size="md"
            >
              연도 추가
            </Button>
          </div>
        </LoginVisible>
      </div>

      {/* 교차표: 목록 표와 같은 모양(/design-system#list), 행 제목 칸만 14/500. 칸 틀은 한 번만(subgrid). */}
      <div className="grid grid-cols-[auto_1fr_1fr_1fr] border-y border-neutral-200 type-ui sm:w-[432px]">
        <TableHeader />
        {CAREER_STAT_ROWS.map((company, index) => (
          <TableRow
            key={index}
            rowName={company}
            values={[
              yearStat.bachelor.find((x) => x.name === company)?.count ?? 0,
              yearStat.master.find((x) => x.name === company)?.count ?? 0,
              yearStat.doctor.find((x) => x.name === company)?.count ?? 0,
            ]}
          />
        ))}
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="col-span-full grid h-11 grid-cols-subgrid items-center border-b border-neutral-200 type-label text-neutral-950">
      <div />
      {CAREER_STAT_COLS.map((colName) => (
        <p key={colName} className="text-center">
          {colName}
        </p>
      ))}
    </div>
  );
}

function TableRow({ rowName, values }: { rowName: string; values: number[] }) {
  return (
    <div className="col-span-full grid h-11 grid-cols-subgrid items-center odd:bg-neutral-50">
      <p className="px-4 type-label text-neutral-950">{rowName}</p>
      {values.map((value, index) => (
        <p key={index} className="text-center">
          {value}
        </p>
      ))}
    </div>
  );
}
