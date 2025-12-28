import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import AlertDialog from '~/components/ui/AlertDialog';
import Button from '~/components/ui/Button';
import { useLanguage } from '~/hooks/useLanguage';

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
}

export default function PostFooter({
  post,
  listPath,
  editPath,
  onDelete,
}: PostFooterProps) {
  const { t, localizedPath } = useLanguage({
    다음글: 'Next',
    이전글: 'Previous',
    목록: 'List',
  });
  const [searchParams] = useSearchParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const nextPost =
    post.nextId && post.nextTitle
      ? { id: post.nextId, title: post.nextTitle }
      : null;
  const prevPost =
    post.prevId && post.prevTitle
      ? { id: post.prevId, title: post.prevTitle }
      : null;

  const pageNum = searchParams.get('pageNum');
  const listHref = pageNum
    ? `${localizedPath(listPath)}?pageNum=${pageNum}`
    : localizedPath(listPath);
  const editHref = editPath ? localizedPath(editPath) : '';

  return (
    <div className="mt-12 flex flex-col">
      {nextPost && (
        <PostNavLink
          href={localizedPath(`${listPath}/${nextPost.id}`)}
          label={t('다음글')}
          title={nextPost.title}
          icon="expand_less"
        />
      )}

      {prevPost && (
        <PostNavLink
          href={localizedPath(`${listPath}/${prevPost.id}`)}
          label={t('이전글')}
          title={prevPost.title}
          icon="expand_more"
        />
      )}

      <div className="mt-16 flex justify-end">
        {(onDelete || editPath) && (
          <LoginVisible allow="ROLE_STAFF">
            <div className="flex items-center">
              {onDelete && (
                <span className="mr-3">
                  <Button
                    variant="outline"
                    tone="neutral"
                    size="md"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    삭제
                  </Button>
                </span>
              )}
              {editPath && (
                <span className="mr-3">
                  <Button
                    as="link"
                    to={editHref}
                    variant="outline"
                    tone="neutral"
                    size="md"
                  >
                    편집
                  </Button>
                </span>
              )}
            </div>
          </LoginVisible>
        )}
        <Button
          as="link"
          to={listHref}
          variant="solid"
          tone="inverse"
          size="md"
        >
          {t('목록')}
        </Button>
      </div>
      {onDelete && (
        <AlertDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          description="선택한 게시글을 삭제하시겠습니까?"
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
  icon: string;
}) => (
  <Link to={href} className="group mb-[2px] flex w-fit items-center">
    <span className="material-symbols-rounded font-normal text-main-orange">
      {icon}
    </span>
    <p className="mr-3 shrink-0 text-md font-medium text-main-orange">
      {label}
    </p>
    <p className="line-clamp-1 text-md font-normal group-hover:underline">
      {title}
    </p>
  </Link>
);
