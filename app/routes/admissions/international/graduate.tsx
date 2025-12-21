import type { Route } from '.react-router/types/app/routes/admissions/international/+types/graduate';
import type { LoaderFunctionArgs } from 'react-router';
import { getLocaleFromPathname } from '~/utils/string';
import AdmissionsPageContent from '../components/AdmissionsPageContent';
import { fetchAdmissions } from '../components/fetchAdmissions';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const data = await fetchAdmissions('international', 'graduate');

  return { description: data[locale].description };
}

export default function InternationalGraduateAdmissionPage({
  loaderData: { description },
}: Route.ComponentProps) {
  return <AdmissionsPageContent description={description} />;
}
