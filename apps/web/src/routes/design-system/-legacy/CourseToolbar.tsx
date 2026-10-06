import { useState } from 'react';
import { LegacyTag } from './Tag';

// d1baf83c 의 apps/web/src/routes/$locale/academics/-components/courses/CourseToolbar.tsx 안 SortOptions 를
// 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다). 예전 교과목 정렬은 태그를 버튼처럼 썼다:
// 고른 것은 주황 채움 태그(누를 수 없음), 나머지는 테두리 태그. 주소 검색 파라미터 대신 화면 안 상태로 바꾼다.
const SORT_OPTIONS = ['학년', '교과목 구분', '학점'] as const;

export function LegacySortOptions() {
  const [selected, setSelected] =
    useState<(typeof SORT_OPTIONS)[number]>('학년');
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {SORT_OPTIONS.map((option) => (
        <LegacyTag
          key={option}
          label={option}
          variant={option === selected ? 'solid' : 'outline'}
          onClick={option === selected ? undefined : () => setSelected(option)}
        />
      ))}
    </div>
  );
}
