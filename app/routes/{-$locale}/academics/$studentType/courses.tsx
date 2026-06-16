import { createFileRoute } from '@tanstack/react-router';
import { BASE_URL } from '~/constants/api';
import CoursesPage from '~/routes/{-$locale}/academics/components/courses/CoursesPage';
import type { Course, StudentType } from '~/types/api/v2/academics';
import { fetchJson } from '~/utils/fetch';

function CoursesRoute() {
  const loaderData = Route.useLoaderData();
  const params = Route.useParams();

  const { studentType } = params;
  return (
    <CoursesPage
      courses={loaderData}
      studentType={studentType as StudentType}
      hideSortOption={studentType === 'graduate'}
    />
  );
}

export const Route = createFileRoute(
  '/{-$locale}/academics/$studentType/courses',
)({
  loader: async ({ params }) => {
    const { studentType } = params;
    const locale = params.locale === 'en' ? 'en' : 'ko';
    return await fetchJson<Course[]>(
      `${BASE_URL}/v2/academics/courses?studentType=${studentType}&sort=${locale}`,
    );
  },
  component: CoursesRoute,
});
