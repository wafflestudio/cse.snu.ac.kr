import { createFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { api } from '@/utils/api';
import { pageNumParam } from '@/utils/searchSchema';
import 'dayjs/locale/ko';
import { useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import HTMLViewer from '@/components/ui/HTMLViewer';
import { toast, toastError } from '@/components/ui/sonner';
import { useCountView } from '@/hooks/useCountView';
import { useLanguage } from '@/hooks/useLanguage';
import { useCommunitySubNav } from '@/hooks/useSubNav';
import PostDetail from '@/routes/$locale/community/-components/PostDetail';
import PostFooter from '@/routes/$locale/community/-components/PostFooter';
import { prepareHtmlForViewer } from '@/serverFns/prepareHtmlForViewer';
import type { Notice } from '@/types/api';
import { stripHtml, truncateDescription } from '@/utils/string';

function NoticeDetailPage() {
  const notice = Route.useLoaderData();

  const { t, locale, localizedPath } = useLanguage({ 조회: 'Views' });
  const subNav = useCommunitySubNav();
  const navigate = useNavigate();
  useCountView('notice', notice.id);

  // 동적 메타데이터 생성
  const pageTitle =
    locale === 'en' ? `${notice.title} ⋅ Notice` : `${notice.title} ⋅ 공지사항`;

  const pageDescription = notice.description?.html
    ? truncateDescription(stripHtml(notice.description.html))
    : locale === 'en'
      ? 'Notice details from the Department of Computer Science and Engineering at Seoul National University.'
      : '서울대학교 컴퓨터공학부 공지사항 상세 내용입니다.';

  const handleDelete = async () => {
    try {
      await api.delete(`v2/notice/${notice.id}`);
      toast.success('게시글을 삭제했습니다.');
      navigate({ to: localizedPath('/community/notice') });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout
      title={t('공지사항')}
      subNav={subNav}
      bands
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    >
      <PostDetail
        title={notice.title}
        meta={[
          notice.author,
          dayjs(notice.createdAt)
            .locale(locale)
            .format('YYYY/M/DD (ddd) A hh:mm'),
          // 조회 때마다 늘어 정규화가 안 된다 — E2E 가 마스킹하는 지점.
          <span key="views" data-testid="view-count">
            {t('조회')} {notice.viewCount.toLocaleString()}
          </span>,
        ]}
        attachments={notice.attachments ?? []}
        // 서버에서 랜덤 순서로 오는 듯해 정렬한다.
        tags={notice.tags
          .toSorted((a, b) => a.localeCompare(b))
          .map((tag) => ({
            label: tag,
            href: localizedPath(`/community/notice?tag=${tag}`),
          }))}
        footer={
          <PostFooter
            post={notice}
            listPath="/community/notice"
            editPath={`/community/notice/edit/${notice.id}`}
            onDelete={handleDelete}
          />
        }
      >
        <HTMLViewer html={notice.description} />
      </PostDetail>
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/community/notice/$id')({
  validateSearch: (search: Record<string, unknown>) => ({
    pageNum: pageNumParam(search.pageNum),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      throw new Response('Invalid ID', { status: 400 });
    }

    const searchParams = new URLSearchParams();
    searchParams.append('language', locale);

    const pageNum = deps.pageNum;
    if (pageNum) searchParams.append('pageNum', String(pageNum));

    const notice = await api
      .get(`v2/notice/${id}?${searchParams.toString()}`)
      .json<Notice>();

    return {
      ...notice,
      description: await prepareHtmlForViewer({ data: notice.description }),
    };
  },
  component: NoticeDetailPage,
});
