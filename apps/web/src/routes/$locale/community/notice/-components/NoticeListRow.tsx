import { Link, useSearch } from '@tanstack/react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Checkbox from '@/components/ui/Checkbox';
import { useLanguage } from '@/hooks/useLanguage';
import type { NoticePreview } from '@/types/api';
import ClipIcon from '../assets/clip.svg?react';
import LockIcon from '../assets/lock.svg?react';
import PinIcon from '../assets/pin.svg?react';

interface NoticeListRowProps {
  post: NoticePreview;
  isEditMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const NOTICE_ROW_CELL_WIDTH = {
  pin: 'sm:w-[3.125rem]',
  title: 'sm:w-[18.75rem]',
  date: 'sm:w-[8.75rem]',
  views: 'sm:w-[4.5rem]',
} as const;

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
      className={`flex flex-col gap-2.5 px-7 py-6 text-md sm:h-11 sm:flex-row sm:items-center sm:gap-0 sm:px-0 sm:py-2.5 ${
        post.isPinned && 'font-semibold'
      } ${!isEditMode && (post.isPrivate ? 'bg-neutral-200' : 'odd:bg-neutral-50')} ${
        isSelected && 'bg-neutral-100'
      }`}
    >
      {isEditMode && (
        <span
          className={`${NOTICE_ROW_CELL_WIDTH.pin} hidden shrink-0 sm:flex justify-center`}
        >
          <Checkbox checked={isSelected} onChange={() => onToggleSelect?.()} />
        </span>
      )}

      <span
        className={`${NOTICE_ROW_CELL_WIDTH.pin} ${
          !(post.isPrivate || post.isPinned) && 'hidden'
        } shrink-0 justify-center sm:flex sm:px-3.25`}
      >
        {post.isPrivate ? <LockIcon /> : post.isPinned && <PinIcon />}
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
        <span
          className={`${NOTICE_ROW_CELL_WIDTH.date} shrink-0 tracking-wide sm:pl-8 sm:pr-6`}
        >
          {dayjs(post.createdAt).locale(locale).format('YYYY/M/DD')}
        </span>

        {/* 조회 때마다 늘어 정규화가 안 된다 — E2E 가 마스킹하는 지점. */}
        <span
          data-testid="view-count"
          className={`${NOTICE_ROW_CELL_WIDTH.views} shrink-0 tracking-wide sm:pr-10`}
        >
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
      className={`flex items-center gap-1.5 font-semibold sm:font-normal ${NOTICE_ROW_CELL_WIDTH.title} min-w-0 grow sm:pl-3`}
    >
      <span
        className={`${
          isPinned && 'font-semibold text-main-orange sm:text-neutral-800'
        } overflow-hidden text-ellipsis text-base tracking-wide hover:text-main-orange sm:whitespace-nowrap sm:text-md`}
      >
        {title}
      </span>
      {hasAttachment && <ClipIcon className="shrink-0" />}
    </Wrapper>
  );
}
