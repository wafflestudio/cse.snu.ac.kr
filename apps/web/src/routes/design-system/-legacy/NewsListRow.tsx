import { stay } from '../-components/sample';
import { LegacyTag } from './Tag';

// d1baf83c 의 apps/web/src/routes/$locale/community/news/-components/NewsListRow.tsx 를 옮긴 사본.
// DS 문서 전용(앱 코드에서 가져오지 않는다). 새 소식 목록 한 줄. 날짜는 글자 그대로 받고,
// 라우터 링크는 이동하지 않는 <a href="#"> 로 바꿨다. 견본 칸이 좁아 오른쪽 사진 자리는 뺐다.
// 요약 링크의 break-all 이 예전 그대로다(낱말 중간 줄바꿈).

interface LegacyNewsPost {
  title: string;
  description: string;
  date: string;
  viewCount: number;
  tags: string[];
}

export function LegacyNewsListRow({ post }: { post: LegacyNewsPost }) {
  return (
    <article className="flex flex-col-reverse gap-4 border-b border-neutral-100 pb-5 sm:flex-row sm:gap-8">
      <div className="flex flex-1 flex-col justify-between break-keep">
        <p className="mb-2.5 mt-5 flex items-center gap-2.5 text-md text-neutral-800 sm:hidden">
          <time>{post.date}</time>
          <span>조회수 {post.viewCount.toLocaleString()}</span>
        </p>

        <div className="flex flex-col items-start">
          <a href="#" onClick={stay} className="hover:underline">
            <h3 className="mb-2.5 text-base font-bold">{post.title}</h3>
          </a>

          <a
            href="#"
            onClick={stay}
            className="mb-3 line-clamp-3 break-all text-md font-normal leading-[1.6] text-neutral-500 hover:cursor-pointer sm:mb-8"
          >
            {post.description}...
          </a>
        </div>

        <div className="flex items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            {post.tags.map((tag) => (
              <LegacyTag key={tag} label={tag} href="#" />
            ))}
          </div>
          <p className="hidden items-center gap-2.5 self-end whitespace-nowrap text-sm leading-[26px] text-neutral-800 sm:flex">
            <time>{post.date}</time>
            <span>조회수 {post.viewCount.toLocaleString()}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
