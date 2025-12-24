import type { Route } from '.react-router/types/app/routes/community/news/+types/$id';
import dayjs from 'dayjs';
import type { LoaderFunctionArgs } from 'react-router';
import Attachments from '~/components/common/Attachments';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import LoginVisible from '~/components/common/LoginVisible';
import Node from '~/components/common/Nodes';
import { Tag } from '~/components/common/Tag';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import PostFooter from '~/routes/community/components/PostFooter';
import type { News } from '~/types/api/v2/news';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    throw new Response('Invalid ID', { status: 400 });
  }

  const searchParams = new URLSearchParams();
  searchParams.append('language', locale);

  const pageNum = url.searchParams.get('pageNum');
  if (pageNum) searchParams.append('pageNum', pageNum);

  const response = await fetch(
    `${BASE_URL}/v2/news/${id}?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Response('Not Found', { status: 404 });
  }

  return (await response.json()) as News;
}

export default function NewsDetailPage({
  loaderData: news,
}: Route.ComponentProps) {
  const { t, locale, localizedPath } = useLanguage();
  const subNav = useCommunitySubNav();

  return (
    <PageLayout
      title={t('새 소식')}
      titleSize="xl"
      breadcrumb={[
        { name: t('소식'), path: '/community' },
        { name: t('새 소식'), path: '/community/news' },
      ]}
      subNav={subNav}
      padding="none"
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="px-5 pt-9 text-right sm:pl-[100px] sm:pr-[340px]">
          <Button
            as="link"
            to={localizedPath(`/community/news/edit/${news.id}`)}
            variant="outline"
            tone="neutral"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>
      <div className="flex flex-col gap-4 px-5 py-9 sm:pl-[100px] sm:pr-[340px]">
        <h2 className="text-[1.25rem] font-semibold leading-[1.4]">
          {news.title}
        </h2>
        <time className="text-sm font-normal tracking-wide text-neutral-500">
          {dayjs(news.date).locale(locale).format('YYYY/M/DD (ddd)')}
        </time>
      </div>

      <div className="bg-neutral-50 px-5 pt-9 pb-16 sm:pl-[100px] sm:pr-[340px]">
        <Attachments files={news.attachments} />

        <HTMLViewer
          html={news.description}
          image={
            news.imageURL && {
              src: news.imageURL,
              width: 320,
              height: 240,
              mobileFullWidth: false,
            }
          }
        />

        <Node variant="straight" />

        {news.tags.length > 0 && (
          <div className="mt-3 ml-6 flex flex-wrap gap-2.5">
            {news.tags.map((tag) => (
              <Tag
                key={tag}
                label={tag}
                href={localizedPath(`/community/news?tag=${tag}`)}
              />
            ))}
          </div>
        )}

        <PostFooter post={news} listPath="/community/news" />
      </div>
    </PageLayout>
  );
}
