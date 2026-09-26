import { Link, useSearch } from '@tanstack/react-router';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { withObjectParticle } from '@/utils/string';

interface PostFooterProps {
  post: {
    nextId: number | null;
    nextTitle: string | null;
    prevId: number | null;
    prevTitle: string | null;
  };
  listPath: string;
  editPath?: string;
  onDelete?: () => Promise<void>;
  /** 삭제 확인창의 대상 — "‘제목’ 공지사항"(/design-system/writing). */
  deleteLabel?: string;
}

export default function PostFooter({
  post,
  listPath,
  editPath,
  onDelete,
  deleteLabel = '이 게시물',
}: PostFooterProps) {
  const { t, localizedPath } = useLanguage({
    다음글: 'Next',
    이전글: 'Previous',
    목록: 'List',
  });
  const search = useSearch({ strict: false });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const nextPost =
    post.nextId && post.nextTitle
      ? { id: post.nextId, title: post.nextTitle }
      : null;
  const prevPost =
    post.prevId && post.prevTitle
      ? { id: post.prevId, title: post.prevTitle }
      : null;

  const pageNum = search.pageNum;
  const listHref = pageNum
    ? `${localizedPath(listPath)}?pageNum=${pageNum}`
    : localizedPath(listPath);
  const editHref = editPath ? localizedPath(editPath) : '';

  return (
    <div className="mt-12 flex flex-col">
      {/* 다음글·이전글 사이 8(/design-system/post). */}
      <div className="flex flex-col gap-2">
        {nextPost && (
          <PostNavLink
            href={localizedPath(`${listPath}/${nextPost.id}`)}
            label={t('다음글')}
            title={nextPost.title}
            icon={<ChevronUp />}
          />
        )}

        {prevPost && (
          <PostNavLink
            href={localizedPath(`${listPath}/${prevPost.id}`)}
            label={t('이전글')}
            title={prevPost.title}
            icon={<ChevronDown />}
          />
        )}
      </div>

      <div className="mt-12 flex justify-end gap-3">
        {(onDelete || editPath) && (
          <LoginVisible allow="ROLE_STAFF">
            <div className="flex items-center gap-3">
              {onDelete && (
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  삭제
                </Button>
              )}
              {editPath && (
                <Button as="link" to={editHref} variant="secondary">
                  편집
                </Button>
              )}
            </div>
          </LoginVisible>
        )}
        <Button as="link" to={listHref} variant="secondary">
          {t('목록')}
        </Button>
      </div>
      {onDelete && (
        <AlertDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          description={`${withObjectParticle(deleteLabel)} 삭제하시겠습니까?\n되돌릴 수 없습니다.`}
          confirmText="삭제"
          onConfirm={async () => {
            try {
              await onDelete();
            } finally {
              setShowDeleteDialog(false);
            }
          }}
        />
      )}
    </div>
  );
}

const PostNavLink = ({
  href,
  label,
  title,
  icon,
}: {
  href: string;
  label: string;
  title: string;
  icon: ReactNode;
}) => (
  <Link to={href} className="group flex w-fit items-center">
    <span className="type-label text-main-orange">{icon}</span>
    <p className="mr-3 shrink-0 type-label text-main-orange">{label}</p>
    <p className="line-clamp-1 type-ui group-hover:underline">{title}</p>
  </Link>
);
