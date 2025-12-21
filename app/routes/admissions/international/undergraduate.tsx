import type { Route } from '.react-router/types/app/routes/admissions/international/+types/undergraduate';
import type { LoaderFunctionArgs } from 'react-router';
import { getLocaleFromPathname } from '~/utils/string';
import AdmissionsPageContent from '../components/AdmissionsPageContent';
import { fetchAdmissions } from '../components/fetchAdmissions';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const data = await fetchAdmissions('international', 'undergraduate');

  return { description: data[locale].description };
}

export default function InternationalUndergraduateAdmissionPage({
  loaderData: { description },
}: Route.ComponentProps) {
  return <AdmissionsPageContent description={description} />;
}
