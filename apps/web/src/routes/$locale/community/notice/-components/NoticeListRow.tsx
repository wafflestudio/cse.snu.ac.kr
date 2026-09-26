import { Link, useSearch } from '@tanstack/react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Lock, Paperclip, Pin } from 'lucide-react';
import Checkbox from '@/components/ui/Checkbox';
import { useLanguage } from '@/hooks/useLanguage';
import type { NoticePreview } from '@/types/api';

interface NoticeListRowProps {
  post: NoticePreview;
  isEditMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export default function NoticeListRow({
  post,
  isEditMode = false,
  isSelected = false,
  onToggleSelect,
}: NoticeListRowProps) {
  const search = useSearch({ strict: false });
  const { t, locale } = useLanguage({ 조회수: 'Views' });

  return (
    <li
      className={`flex flex-col gap-2 px-6 py-6 type-ui sm:col-span-full sm:grid sm:h-11 sm:grid-cols-subgrid sm:items-center sm:gap-0 sm:px-0 sm:py-0 ${
        post.isPinned && 'font-bold'
      } ${!isEditMode && (post.isPrivate ? 'bg-neutral-200' : 'odd:bg-neutral-50')} ${
        isSelected && 'bg-neutral-100'
      }`}
    >
      {isEditMode && (
        <span className="hidden justify-center px-3 sm:flex">
          <Checkbox checked={isSelected} onChange={() => onToggleSelect?.()} />
        </span>
      )}

      <span
        className={`${
          !(post.isPrivate || post.isPinned) && 'hidden'
        } justify-center sm:flex sm:px-3`}
      >
        {post.isPrivate ? (
          <Lock className="text-neutral-500" />
        ) : (
          post.isPinned && (
            <Pin className="text-main-orange" fill="currentColor" />
          )
        )}
      </span>

      <TitleCell
        title={post.title}
        hasAttachment={post.hasAttachment}
        id={post.id}
        isPinned={post.isPinned}
        pageNum={search.pageNum ? String(search.pageNum) : null}
        isEditMode={isEditMode}
      />

      <div className="flex gap-3 sm:contents">
        <span className="sm:pl-8 sm:pr-6">
          {dayjs(post.createdAt).locale(locale).format('YYYY/M/DD')}
        </span>

        {/* 조회 때마다 늘어 정규화가 안 된다 — E2E 가 마스킹하는 지점. */}
        <span data-testid="view-count" className="sm:pr-8">
          {/* 데스크톱은 열 머리글이 '조회'를 말해준다. */}
          <span className="sm:hidden">{t('조회수')} </span>
          {post.viewCount.toLocaleString()}
        </span>
      </div>
    </li>
  );
}

interface TitleCellProps {
  title: string;
  hasAttachment: boolean;
  id: number;
  isPinned: boolean;
  pageNum: string | null;
  isEditMode: boolean;
}

function TitleCell({
  title,
  hasAttachment,
  id,
  isPinned,
  pageNum,
  isEditMode,
}: TitleCellProps) {
  const { localizedPath } = useLanguage({});
  const detailPath = pageNum
    ? localizedPath(`/community/notice/${id}?pageNum=${pageNum}`)
    : localizedPath(`/community/notice/${id}`);

  const Wrapper = isEditMode ? 'span' : Link;

  return (
    <Wrapper
      to={detailPath}
      className="flex min-w-0 items-center gap-1 type-item sm:type-ui sm:pl-3"
    >
      <span
        className={`${
          isPinned && 'font-bold text-main-orange sm:text-neutral-950'
        } overflow-hidden text-ellipsis type-item tracking-wide hover:text-main-orange sm:type-ui sm:whitespace-nowrap`}
      >
        {title}
      </span>
      {hasAttachment && <Paperclip className="shrink-0 text-neutral-500" />}
    </Wrapper>
  );
}
