import { createFileRoute, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { api } from '@/utils/api';
import { pageNumParam } from '@/utils/searchSchema';
import 'dayjs/locale/ko';
import type { ReactNode } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import HTMLViewer from '@/components/ui/HTMLViewer';
import Image from '@/components/ui/Image';
import { toast, toastError } from '@/components/ui/sonner';
import { useCountView } from '@/hooks/useCountView';
import { useLanguage } from '@/hooks/useLanguage';
import { useCommunitySubNav } from '@/hooks/useSubNav';
import PostDetail from '@/routes/$locale/community/-components/PostDetail';
import PostFooter from '@/routes/$locale/community/-components/PostFooter';
import { prepareHtmlForViewer } from '@/serverFns/prepareHtmlForViewer';
import type { Seminar } from '@/types/api';
import { stripHtml, truncateDescription } from '@/utils/string';

function SeminarDetailPage() {
  const seminar = Route.useLoaderData();

  const { t, locale, localizedPath } = useLanguage({
    세미나: 'Seminars',
    소식: 'Community',
    연사: 'Speaker',
    주최: 'Host',
    요약: 'Summary',
    '연사 소개': 'Speaker Introduction',
  });
  const subNav = useCommunitySubNav();
  const navigate = useNavigate();
  useCountView('seminar', seminar.id);

  // 동적 메타데이터 생성
  const pageTitle =
    locale === 'en'
      ? `${seminar.title} ⋅ Seminar`
      : `${seminar.title} ⋅ 세미나`;

  const pageDescription = seminar.introduction?.html
    ? truncateDescription(stripHtml(seminar.introduction.html))
    : locale === 'en'
      ? 'Seminar information from the Department of Computer Science and Engineering at Seoul National University.'
      : '서울대학교 컴퓨터공학부 세미나 정보입니다.';

  const handleDelete = async () => {
    try {
      await api.delete(`v2/seminar/${seminar.id}`);
      toast.success('게시물을 삭제했습니다.');
      navigate({ to: localizedPath('/community/seminar') });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout
      title={t('세미나')}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      subNav={subNav}
      bands
    >
      <PostDetail
        title={seminar.title}
        // 언제·어디서·누가 여는지는 제목 바로 아래 정보 줄로.
        meta={[
          formatStartEndDate(seminar.startDate, seminar.endDate, locale),
          seminar.location,
          `${t('주최')} ${seminar.host}`,
        ]}
        attachments={seminar.attachments ?? []}
        footer={
          <PostFooter
            post={seminar}
            listPath="/community/seminar"
            editPath={`/community/seminar/edit/${seminar.id}`}
            onDelete={handleDelete}
            deleteLabel={`‘${seminar.title}’ 세미나`}
          />
        }
      >
        {/* 대표 이미지는 오른쪽에 띄우고 글이 감싸 흐른다(모바일은 위) — 새 소식 본문 이미지와 같다.
            이미지 아래부터는 글이 다시 읽기 폭(640)까지 넓어진다. */}
        <div className="flow-root">
          {seminar.imageURL && (
            <div className="relative mb-8 w-full sm:float-right sm:ml-8 sm:w-60">
              <Image
                alt="대표 이미지"
                src={seminar.imageURL}
                sizes="(min-width: 1024px) 240px, 100vw"
                className="aspect-square w-full object-contain"
              />
            </div>
          )}

          {/* 연사도 요약·연사 소개와 같은 소제목 + 본문 짜임. */}
          <div className="mb-2 type-item">{t('연사')}</div>
          <p className="type-body">
            <LinkOrText href={seminar.speakerURL}>{seminar.name}</LinkOrText>
            {seminar.speakerTitle && ` · ${seminar.speakerTitle}`}
            {' · '}
            <LinkOrText href={seminar.affiliationURL}>
              {seminar.affiliation}
            </LinkOrText>
          </p>

          {seminar.description && (
            <>
              <div className="mt-12 mb-2 type-item">{t('요약')}</div>
              <HTMLViewer html={seminar.description} />
            </>
          )}

          {seminar.introduction && (
            <>
              <div className="mt-12 mb-2 type-item">{t('연사 소개')}</div>
              <HTMLViewer html={seminar.introduction} />
            </>
          )}
        </div>
      </PostDetail>
    </PageLayout>
  );
}

const LinkOrText = ({
  href,
  children,
}: {
  href: string | null;
  children: ReactNode;
}) => {
  if (!href) return <span className="inline">{children}</span>;

  return (
    <a
      className="text-link underline underline-offset-2 hover:text-link-hover"
      href={href}
    >
      {children}
    </a>
  );
};

const formatStartEndDate = (
  startDateStr: string,
  endDateStr: string | null,
  locale: string,
) => {
  const startDate = dayjs(startDateStr).locale(locale);

  if (!endDateStr) {
    if (startDate.hour() === 0 && startDate.minute() === 0) {
      return startDate.format('YYYY/M/DD');
    }
    return startDate.format('YYYY/M/DD A hh:mm');
  }

  const endDate = dayjs(endDateStr).locale(locale);

  if (startDate.isSame(endDate, 'day')) {
    return `${startDate.format('YYYY/M/DD A hh:mm')} - ${endDate.format('A hh:mm')}`;
  }

  return `${startDate.format('YYYY/M/DD A hh:mm')} - ${endDate.format('YYYY/M/DD A hh:mm')}`;
};

export const Route = createFileRoute('/$locale/community/seminar/$id')({
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

    const seminar = await api
      .get(`v2/seminar/${id}?${searchParams.toString()}`)
      .json<Seminar>();

    return {
      ...seminar,
      description: seminar.description
        ? await prepareHtmlForViewer({ data: seminar.description })
        : null,
      introduction: seminar.introduction
        ? await prepareHtmlForViewer({ data: seminar.introduction })
        : null,
    };
  },
  component: SeminarDetailPage,
});
