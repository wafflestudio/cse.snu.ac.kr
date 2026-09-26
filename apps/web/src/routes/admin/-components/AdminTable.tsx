import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Checkbox from '@/components/ui/Checkbox';
import { useLanguage } from '@/hooks/useLanguage';
import type { ImportantPreview, SlidePreview } from '@/types/api';

// 백엔드가 category를 enum이 아닌 String으로 내보내 스펙에 값 목록이 없다.
// 백엔드에서 enum으로 조이면 Record<string, …>을 좁힐 수 있다.
const CATEGORY_PATHS: Record<string, string> = {
  notice: '/community/notice',
  news: '/community/news',
  seminar: '/community/seminar',
};

const CATEGORY_LABELS: Record<string, string> = {
  notice: '공지사항',
  news: '새 소식',
  seminar: '세미나',
};

type AdminTableProps = {
  selectedKeys: Set<string>;
  onToggleSelection: (key: string) => void;
} & (
  | { type: 'slide'; posts: SlidePreview[] }
  | { type: 'important'; posts: ImportantPreview[] }
);

export default function AdminTable({
  type,
  posts,
  selectedKeys,
  onToggleSelection,
}: AdminTableProps) {
  const { locale, localizedPath } = useLanguage();

  return (
    // 칸 틀은 표에 한 번만 — 머리 행·행이 같이 쓴다(subgrid). 제목 칸만 남는 자리.
    <div
      className={clsx(
        'mx-3 mb-8 grid border-y border-neutral-200',
        type === 'important'
          ? 'grid-cols-[auto_auto_auto_minmax(0,1fr)_auto_auto]'
          : 'grid-cols-[auto_auto_minmax(0,1fr)_auto_auto]',
      )}
    >
      {/* Header */}
      <div className="col-span-full grid h-11 grid-cols-subgrid items-center whitespace-nowrap border-b border-neutral-200 type-label text-neutral-950">
        <div className="px-3 whitespace-nowrap text-center">선택</div>
        <div className="px-3 whitespace-nowrap text-center">번호</div>
        {type === 'important' && (
          <div className="px-3 whitespace-nowrap text-center">분류</div>
        )}
        <div className="min-w-0 pl-3 text-left">제목</div>
        <div className="px-3 whitespace-nowrap pl-8 text-left">날짜</div>
        <div className="px-3 whitespace-nowrap pl-3 text-left">편집</div>
      </div>

      {/* Body */}
      <ul className="col-span-full grid grid-cols-subgrid">
        {posts.map((post, index) => {
          const key =
            type === 'slide'
              ? post.id.toString()
              : `${(post as ImportantPreview).category}-${post.id}`;
          const isSelected = selectedKeys.has(key);
          const editPath =
            type === 'slide'
              ? `/community/news/edit/${post.id}`
              : // TODO: 좀 더 이쁘게 타입 잡기
                `${CATEGORY_PATHS[(post as ImportantPreview).category]}/edit/${post.id}`;

          return (
            <li
              key={key}
              className={clsx(
                'col-span-full grid h-11 grid-cols-subgrid items-center type-ui odd:bg-neutral-50',
                isSelected && 'bg-neutral-100',
              )}
            >
              {/* 선택 */}
              <div className="px-3 flex shrink-0 justify-center">
                <Checkbox
                  checked={isSelected}
                  onChange={() => onToggleSelection(key)}
                />
              </div>

              {/* 번호 */}
              <div className="px-3 whitespace-nowrap text-center">
                {index + 1}
              </div>

              {/* 분류 (important만) */}
              {type === 'important' && (
                <div className="px-3 whitespace-nowrap text-center">
                  {CATEGORY_LABELS[(post as ImportantPreview).category] ||
                    (post as ImportantPreview).category}
                </div>
              )}

              {/* 제목 */}
              <div className="min-w-0 pl-3">
                <Link
                  to={localizedPath(
                    type === 'slide'
                      ? `/community/news/${post.id}`
                      : `${CATEGORY_PATHS[(post as ImportantPreview).category]}/${post.id}`,
                  )}
                  className="block overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
                >
                  {post.title}
                </Link>
              </div>

              {/* 날짜 */}
              <div className="px-3 whitespace-nowrap pl-8">
                {dayjs(post.createdAt).locale(locale).format('YYYY/MM/DD')}
              </div>

              {/* 편집 */}
              <div className="px-3 whitespace-nowrap pl-3">
                <Link
                  to={editPath}
                  className="type-label text-main-orange hover:underline"
                >
                  편집
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
