import { Link, useSearchParams } from 'react-router';
import Button from '~/components/common/Button';
import { useLanguage } from '~/hooks/useLanguage';

interface PostFooterProps {
  post: {
    nextId: number | null;
    nextTitle: string | null;
    prevId: number | null;
    prevTitle: string | null;
  };
  listPath: string;
}

export default function PostFooter({ post, listPath }: PostFooterProps) {
  const { t, localizedPath } = useLanguage({
    다음글: 'Next',
    이전글: 'Previous',
    목록: 'List',
  });
  const [searchParams] = useSearchParams();

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

  return (
    <div className="mt-12 flex flex-col">
      {nextPost && (
        <Link
          to={localizedPath(`${listPath}/${nextPost.id}`)}
          className="group mb-[2px] flex w-fit items-center"
        >
          <span className="material-symbols-rounded font-normal text-main-orange">
            expand_less
          </span>
          <p className="mr-3 flex-shrink-0 text-md font-medium text-main-orange">
            {t('다음글')}
          </p>
          <p className="line-clamp-1 text-md font-normal group-hover:underline">
            {nextPost.title}
          </p>
        </Link>
      )}

      {prevPost && (
        <Link
          to={localizedPath(`${listPath}/${prevPost.id}`)}
          className="group mb-[2px] flex w-fit items-center"
        >
          <span className="material-symbols-rounded font-normal text-main-orange">
            expand_more
          </span>
          <p className="mr-3 flex-shrink-0 text-md font-medium text-main-orange">
            {t('이전글')}
          </p>
          <p className="line-clamp-1 text-md font-normal group-hover:underline">
            {prevPost.title}
          </p>
        </Link>
      )}

      <div className="mt-16 flex justify-end">
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
    </div>
  );
}
