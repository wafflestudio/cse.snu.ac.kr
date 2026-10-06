import { Search } from 'lucide-react';
import { useId, useState } from 'react';

// d1baf83c 의 apps/web/src/routes/$locale/community/seminar/-components/SeminarSearchBar.tsx 를 옮긴 사본.
// DS 문서 전용(앱 코드에서 가져오지 않는다). 예전 세미나 검색: 굵은 "검색" 이름 + 회색 채움 칸,
// outline-none 이라 초점 표시가 없다. 주소 검색 파라미터 대신 제출해도 아무 일도 일어나지 않는다.
export function LegacySeminarSearchBar() {
  const [text, setText] = useState('');
  const id = useId();
  return (
    <form
      className="flex w-fit items-center gap-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor={id} className="font-bold">
        검색
      </label>
      <div className="flex h-7.5 w-60 items-center rounded-sm bg-neutral-100 pr-3">
        <input
          type="text"
          id={id}
          className="w-full rounded-sm bg-transparent px-2 text-sm tracking-wide outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="text-neutral-800 hover:text-neutral-500"
          aria-label="검색"
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>
    </form>
  );
}
