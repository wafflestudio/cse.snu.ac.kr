import { createFileRoute, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import PageLayout from '@/components/layout/PageLayout';
import HTMLViewer from '@/components/ui/HTMLViewer';
import { toast, toastError } from '@/components/ui/sonner';
import { useCountView } from '@/hooks/useCountView';
import { useLanguage } from '@/hooks/useLanguage';
import { useCommunitySubNav } from '@/hooks/useSubNav';
import PostDetail from '@/routes/$locale/community/-components/PostDetail';
import PostFooter from '@/routes/$locale/community/-components/PostFooter';
import { prepareHtmlForViewer } from '@/serverFns/prepareHtmlForViewer';
import type { News } from '@/types/api';
import { api } from '@/utils/api';
import { pageNumParam } from '@/utils/searchSchema';
import { stripHtml, truncateDescription } from '@/utils/string';

function NewsDetailPage() {
  const news = Route.useLoaderData();

  const { t, locale, localizedPath } = useLanguage({ 조회: 'Views' });
  const subNav = useCommunitySubNav();
  const navigate = useNavigate();
  useCountView('news', news.id);

  // 동적 메타데이터 생성
  const pageTitle =
    locale === 'en' ? `${news.title} ⋅ News` : `${news.title} ⋅ 새 소식`;

  const pageDescription = news.description?.html
    ? truncateDescription(stripHtml(news.description.html))
    : locale === 'en'
      ? 'News from the Department of Computer Science and Engineering at Seoul National University.'
      : '서울대학교 컴퓨터공학부의 새 소식입니다.';

  const handleDelete = async () => {
    try {
      await api.delete(`v2/news/${news.id}`);
      toast.success('게시글을 삭제했습니다.');
      navigate({ to: localizedPath('/community/news') });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout
      title={t('새 소식')}
      subNav={subNav}
      bands
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    >
      <PostDetail
        title={news.title}
        meta={[
          <time key="date">
            {dayjs(news.date).locale(locale).format('YYYY/M/DD (ddd)')}
          </time>,
          // 조회 때마다 늘어 정규화가 안 된다 — E2E 가 마스킹하는 지점.
          <span key="views" data-testid="view-count">
            {t('조회')} {news.viewCount.toLocaleString()}
          </span>,
        ]}
        attachments={news.attachments ?? []}
        // 서버에서 랜덤 순서로 오는 듯해 정렬한다.
        tags={news.tags
          .toSorted((a, b) => a.localeCompare(b))
          .map((tag) => ({
            label: tag,
            href: localizedPath(`/community/news?tag=${tag}`),
          }))}
        footer={
          <PostFooter
            post={news}
            listPath="/community/news"
            editPath={`/community/news/edit/${news.id}`}
            onDelete={handleDelete}
          />
        }
      >
        <HTMLViewer
          html={news.description}
          image={
            news.imageURL && {
              src: news.imageURL,
              width: 320,
              height: 240,
            }
          }
        />
      </PostDetail>
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/community/news/$id')({
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

    const news = await api
      .get(`v2/news/${id}?${searchParams.toString()}`)
      .json<News>();

    return {
      ...news,
      description: await prepareHtmlForViewer({ data: news.description }),
    };
  },
  component: NewsDetailPage,
});
