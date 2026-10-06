// d1baf83c 의 apps/web/src/routes/$locale/community/notice/$id.tsx 의 머리(제목 + 정보 줄)를 옮긴 사본.
// DS 문서 전용(앱 코드에서 가져오지 않는다). 정보 줄은 "작성자:"·"작성 날짜:" 이름표를 붙인 p 들을 20 간격으로 늘어놨다.
// 바깥 page-gutter-x·py-9 는 견본 칸에 맞춰 뺐고, 좁은 견본 칸에서 넘치지 않게 정보 줄에 flex-wrap 만 더했다.
export function LegacyNoticeDetailHead({
  title,
  author,
  createdAt,
  viewCount,
}: {
  title: string;
  author: string;
  createdAt: string;
  viewCount: string;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-[1.25rem] font-semibold leading-[1.4]">{title}</h2>
      <div className="flex flex-wrap gap-5 text-sm font-normal tracking-wide text-neutral-500">
        <p>작성자: {author}</p>
        <p>작성 날짜: {createdAt}</p>
        <p>조회수 {viewCount}</p>
      </div>
    </div>
  );
}
