import type { Route } from '.react-router/types/app/routes/admissions/undergraduate/+types/early-admission';
import type { LoaderFunctionArgs } from 'react-router';
import { getLocaleFromPathname } from '~/utils/string';
import AdmissionsPageContent from '../components/AdmissionsPageContent';
import { fetchAdmissions } from '../components/fetchAdmissions';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const data = await fetchAdmissions('undergraduate', 'early-admission');

  return { description: data[locale].description };
}

export default function UndergraduateEarlyAdmissionPage({
  loaderData: { description },
}: Route.ComponentProps) {
  return <AdmissionsPageContent description={description} />;
}
