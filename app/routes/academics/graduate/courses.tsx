import type { Route } from '.react-router/types/app/routes/academics/graduate/+types/courses';
import { BASE_URL } from '~/constants/api';
import CoursesPage from '~/routes/academics/components/courses/CoursesPage';
import type { Course } from '~/types/api/v2/academics';
import { fetchJson } from '~/utils/fetch';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  return await fetchJson<Course[]>(
    `${BASE_URL}/v2/academics/courses?studentType=graduate&sort=${locale}`,
  );
}

export default function GraduateCoursesPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <CoursesPage courses={loaderData} studentType="graduate" hideSortOption />
  );
}
