import { createFileRoute, notFound } from '@tanstack/react-router';
import NotFound from '@/components/layout/NotFound';
import { processHtmlForCsp } from '@/serverFns/processHtmlForCsp';
import type { AdmissionsMainType, AdmissionsPostType } from '@/types/api';
import AdmissionsPageContent from '../../-components/AdmissionsPageContent';
import { fetchAdmissions } from '../../-components/fetchAdmissions';

type PageConfig = {
  apiPostType: AdmissionsPostType;
  layout?: 'default' | 'extraBottom';
};

// URL 세그먼트(mainType/postType) → 백엔드 postType 매핑. URL의 postType과 API 값이 다른 곳이 있다(exchange).
// 바깥 키는 백엔드 enum(AdmissionsMainType)과 1:1 — 값이 바뀌면 타입이 컴파일을 깨뜨린다.
const ADMISSIONS_PAGES: Record<
  AdmissionsMainType,
  Record<string, PageConfig>
> = {
  undergraduate: {
    'regular-admission': { apiPostType: 'regular-admission' },
    'early-admission': { apiPostType: 'early-admission' },
  },
  graduate: {
    'regular-admission': { apiPostType: 'regular-admission' },
  },
  international: {
    undergraduate: { apiPostType: 'undergraduate' },
    graduate: { apiPostType: 'graduate' },
    exchange: { apiPostType: 'exchange-visiting', layout: 'extraBottom' },
    scholarships: { apiPostType: 'scholarships', layout: 'extraBottom' },
  },
};

const isMainType = (value: string): value is AdmissionsMainType =>
  value in ADMISSIONS_PAGES;

const pageConfig = (
  mainType: AdmissionsMainType,
  postType: string,
): PageConfig | undefined =>
  Object.hasOwn(ADMISSIONS_PAGES[mainType], postType)
    ? ADMISSIONS_PAGES[mainType][postType]
    : undefined;

function AdmissionsPage() {
  const { description, layout } = Route.useLoaderData();
  const params = Route.useParams();

  const { mainType, postType } = params;
  return (
    <AdmissionsPageContent
      description={description}
      layout={layout}
      mainType={mainType}
      postType={postType}
    />
  );
}

export const Route = createFileRoute(
  '/$locale/admissions/$mainType/$postType/',
)({
  params: {
    // URL은 아무 문자열이나 올 수 있다. 표에 없는 조합은 백엔드까지 가지 않고 404.
    parse: ({ mainType, postType }) => {
      if (!isMainType(mainType) || !pageConfig(mainType, postType)) {
        throw notFound();
      }
      return { mainType, postType };
    },
    stringify: ({ mainType, postType }) => ({ mainType, postType }),
  },
  notFoundComponent: NotFound,
  loader: async ({ params }) => {
    const { mainType, postType } = params;
    const config = pageConfig(mainType, postType);
    if (!config) throw notFound();

    const locale = params.locale === 'en' ? 'en' : 'ko';
    const data = await fetchAdmissions(mainType, config.apiPostType);

    return {
      description: await processHtmlForCsp({ data: data[locale].description }),
      layout: config.layout,
    };
  },
  component: AdmissionsPage,
});
