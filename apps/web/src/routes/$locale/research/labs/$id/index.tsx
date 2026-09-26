import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import CornerFoldedRectangle from '@/components/ui/CornerFoldedRectangle';
import HTMLViewer from '@/components/ui/HTMLViewer';
import { useLanguage } from '@/hooks/useLanguage';
import { createSelectionUrl } from '@/hooks/useSelectionList';
import { useResearchSubNav } from '@/hooks/useSubNav';
import { prepareHtmlForViewer } from '@/serverFns/prepareHtmlForViewer';
import type { ResearchLabDetail, ResearchLabWithLanguage } from '@/types/api';
import { api } from '@/utils/api';
import { stringParam } from '@/utils/searchSchema';
import { stripHtml, truncateDescription } from '@/utils/string';

function ResearchLabDetailPage() {
  const lab = Route.useLoaderData();

  const { t, localizedPath, locale } = useLanguage({
    '연구실 목록': 'Laboratories',
    연구·교육: 'Research & Edu',
    스트림: 'Stream',
    교수: 'Professor',
    랩실: 'Lab',
    전화: 'Tel',
  });
  const subNav = useResearchSubNav();

  // 메타데이터 생성
  const pageTitle =
    locale === 'en' ? `${lab.name} ⋅ Research Lab` : `${lab.name} ⋅ 연구실`;

  const professorNames = lab.professors.map((p) => p.name).join(', ');
  const pageDescription = lab.description?.html
    ? truncateDescription(stripHtml(lab.description.html))
    : locale === 'en'
      ? `${lab.name} research laboratory${professorNames ? ` - Professor: ${professorNames}` : ''}`
      : `${lab.name} 연구실${professorNames ? ` - 교수: ${professorNames}` : ''}`;

  const researchLabInfo = (
    <LabSummary
      lab={lab}
      localizedPath={localizedPath}
      labels={{
        professor: t('교수'),
        lab: t('랩실'),
        tel: t('전화'),
      }}
    />
  );

  return (
    <PageLayout
      title={lab.name}
      subNav={subNav}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 text-right">
          <Button
            as="link"
            to={localizedPath(`/research/labs/${lab.id}/edit`)}
            variant="secondary"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>

      {lab.groupName && (
        <StreamLink
          groupName={lab.groupName}
          localizedPath={localizedPath}
          label={t('스트림')}
        />
      )}
      <div className={lab.groupName ? 'mt-6' : ''}>
        {/* 모바일은 요약 카드가 본문 폭을 다 쓴다(데스크톱은 본문 오른쪽에 띄운 240). */}
        <div className="mb-6 sm:hidden">{researchLabInfo}</div>
        <HTMLViewer
          html={lab.description}
          component={
            <div className="hidden sm:float-right sm:block">
              {researchLabInfo}
            </div>
          }
        />
      </div>
    </PageLayout>
  );
}

function LabSummary({
  lab,
  localizedPath,
  labels,
}: {
  lab: ProcessedLab;
  localizedPath: (path: string) => string;
  labels: { professor: string; lab: string; tel: string };
}) {
  return (
    <CornerFoldedRectangle
      colorTheme="summary"
      size="large"
      shadow="light"
      margin="sm:mt-[-64px] sm:mb-12 sm:ml-12"
      width="w-full sm:w-fit"
    >
      <ul className="flex h-40 w-full flex-col sm:w-60 gap-1 px-6 py-4">
        <li className="flex gap-1 type-meta">
          <span className="whitespace-nowrap">
            {labels.professor}:{' '}
            {lab.professors.map((info, index) => (
              <span key={info.id}>
                <Link
                  to={localizedPath(`/people/faculty/${info.id}`)}
                  className="hover:text-main-orange"
                >
                  {info.name}
                </Link>
                {index !== lab.professors.length - 1 && ', '}
              </span>
            ))}
          </span>
        </li>
        <li className="flex gap-1 type-meta">
          <span className="whitespace-nowrap">{labels.lab}: </span>
          <span>{lab.location ?? '-'}</span>
        </li>
        <li className="flex grow gap-1 type-meta">
          <span className="whitespace-nowrap">
            {labels.tel}: {lab.tel ?? '-'}
          </span>
        </li>
        {lab.websiteURL && (
          <li>
            <a
              href={lab.websiteURL}
              className="mt-auto w-fit type-meta underline hover:text-main-orange"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          </li>
        )}
      </ul>
    </CornerFoldedRectangle>
  );
}

// 공유값 + 해당 언어 번역본 + CSP 처리된 본문.
type ProcessedLab = Omit<ResearchLabDetail, 'description'> & {
  description: import('@/utils/csp').ViewerHtml;
};

// 이 연구실이 속한 스트림으로 가는 글자 링크 — 메인 "더보기 →"와 같은 모양(/design-system#main).
function StreamLink({
  groupName,
  localizedPath,
  label,
}: {
  groupName: string;
  localizedPath: (path: string) => string;
  label: string;
}) {
  return (
    <Link
      to={localizedPath(createSelectionUrl('/research/groups', groupName))}
      className="flex w-fit items-center gap-1 type-ui text-main-orange-dark hover:underline"
    >
      {groupName} {label} <ArrowRight />
    </Link>
  );
}

export const Route = createFileRoute('/$locale/research/labs/$id/')({
  validateSearch: (search: Record<string, unknown>) => ({
    selected: stringParam(search.selected),
  }),
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      throw new Response('Invalid ID', { status: 400 });
    }

    const data = await api
      .get(`v2/research/lab/${id}`)
      .json<ResearchLabWithLanguage>();

    const translation = data[locale];
    if (!translation) throw new Response('Not Found', { status: 404 });

    // 표시용으로 공유값과 해당 언어값을 합쳐 넘긴다.
    return {
      ...data,
      ...translation,
      description: await prepareHtmlForViewer({
        data: translation.description ?? '',
      }),
    };
  },
  component: ResearchLabDetailPage,
});
