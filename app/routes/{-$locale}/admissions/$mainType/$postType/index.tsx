import { createFileRoute } from '@tanstack/react-router';
import { processHtmlForCsp } from '@/utils/cspServerFn';
import AdmissionsPageContent from '../../components/AdmissionsPageContent';
import {
  fetchAdmissions,
  type MainType,
  type PostType,
} from '../../components/fetchAdmissions';

// Mapping for page configuration
const ADMISSIONS_PAGES: Record<
  string,
  Record<string, { apiPostType: string; layout?: 'default' | 'extraBottom' }>
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
  '/{-$locale}/admissions/$mainType/$postType/',
)({
  loader: async ({ params }) => {
    const { mainType, postType } = params;
    const config = ADMISSIONS_PAGES[mainType]?.[postType];

    if (!config) {
      throw new Error(`Invalid admissions page: ${mainType}/${postType}`);
    }

    const locale = params.locale === 'en' ? 'en' : 'ko';
    const data = await fetchAdmissions(
      mainType as MainType,
      config.apiPostType as PostType,
    );

    return {
      description: await processHtmlForCsp(data[locale].description),
      layout: config.layout,
    };
  },
  component: AdmissionsPage,
});
