import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/routes/$locale/community/notice/-components/NoticeListRow.tsx 와, 그 행을 담던
// notice/index.tsx 의 표 틀(머리 행 포함)을 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 데스크톱 모양으로 고정했다(예전 sm: 값을 그대로 풀어 씀). 편집 모드·고정·비공개·첨부 아이콘은 뺐다.
// 칸 폭을 행마다 고정 폭(w-[18.75rem] 등)으로 적었고, 표 틀이 본문에서 10px 들여 있었다(mx-2.5).
// 링크는 제목 칸 하나뿐이고 호버하면 제목 글자만 주황이 된다(행 바탕은 그대로). 이동하지 않는 <a href="#"> 로 바꿨다.

interface LegacyNoticeRow {
  title: string;
  date: string;
  views: string;
}

export function LegacyNoticeList({ rows }: { rows: LegacyNoticeRow[] }) {
  return (
    <div className="mx-2.5 min-w-0 flex-1 border-y border-neutral-200">
      <h5 className="flex h-11 items-center border-b border-neutral-200 pl-12.5 text-[15px] text-neutral-800">
        <span className="w-[18.75rem] min-w-0 grow whitespace-nowrap pl-3 tracking-wide">
          제목
        </span>
        <span className="w-[8.75rem] shrink-0 whitespace-nowrap pr-6 pl-8 tracking-wide">
          날짜
        </span>
        <span className="w-[4.5rem] shrink-0 whitespace-nowrap pr-10 tracking-wide">
          조회수
        </span>
      </h5>
      <ul>
        {rows.map((row) => (
          <LegacyNoticeListRow key={row.title} {...row} />
        ))}
      </ul>
    </div>
  );
}

function LegacyNoticeListRow({ title, date, views }: LegacyNoticeRow) {
  return (
    <li className="flex h-11 flex-row items-center py-2.5 text-md odd:bg-neutral-50">
      <span className="flex w-[3.125rem] shrink-0 justify-center px-3.25" />
      <a
        href="#"
        onClick={stay}
        className="flex w-[18.75rem] min-w-0 grow items-center gap-1.5 pl-3 font-normal"
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-md tracking-wide hover:text-main-orange">
          {title}
        </span>
      </a>
      <span className="w-[8.75rem] shrink-0 pr-6 pl-8 tracking-wide">
        {date}
      </span>
      <span className="w-[4.5rem] shrink-0 pr-10 tracking-wide">{views}</span>
    </li>
  );
}
