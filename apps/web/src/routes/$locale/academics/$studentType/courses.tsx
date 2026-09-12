import { createFileRoute } from '@tanstack/react-router';
import CoursesPage from '@/routes/$locale/academics/-components/courses/CoursesPage';
import type { Course } from '@/types/api';
import { api } from '@/utils/api';
import { stringParam } from '@/utils/searchSchema';

function CoursesRoute() {
  const loaderData = Route.useLoaderData();
  const params = Route.useParams();

  const { studentType } = params;
  return (
    <CoursesPage
      courses={loaderData}
      studentType={studentType}
      hideSortOption={studentType === 'graduate'}
    />
  );
}

export const Route = createFileRoute('/$locale/academics/$studentType/courses')(
  {
    validateSearch: (search: Record<string, unknown>) => ({
      view: stringParam(search.view),
      sort: stringParam(search.sort),
    }),
    loader: async ({ params }) => {
      const { studentType } = params;
      const locale = params.locale === 'en' ? 'en' : 'ko';
      return await api
        .get(`v2/academics/courses?studentType=${studentType}&sort=${locale}`)
        .json<Course[]>();
    },
    component: CoursesRoute,
  },
);
