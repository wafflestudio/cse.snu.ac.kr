import {
  route as _route,
  layout,
  prefix,
  type RouteConfig,
} from '@react-router/dev/routes';
import type { Locale } from '~/types/i18n';

const routeFactory: (locale: Locale) => typeof _route =
  (locale) => (path, file, options) => {
    const id = file
      .replace(/^routes\//, '') // Remove 'routes/' prefix
      .replace(/\.tsx$/, '') // Remove '.tsx' extension
      .replace(/\//g, '-'); // Replace '/' with '-'

    return _route(path, file, { ...options, id: `${locale}-${id}` });
  };

const getLocaleRoutes = (locale: Locale) => {
  const route = routeFactory(locale);

  return [
    route('/', 'routes/main/index.tsx'),
    ...prefix('/about', [
      route('/', 'routes/about/index.tsx'),
      route('/overview', 'routes/about/overview.tsx'),
      route('/greetings', 'routes/about/greetings.tsx'),
    ]),
    ...prefix('/community', [route('/', 'routes/community/index.tsx')]),
    ...prefix('/people', [route('/', 'routes/people/index.tsx')]),
    ...prefix('/research', [route('/', 'routes/research/index.tsx')]),
    ...prefix('/admissions', [route('/', 'routes/admissions/index.tsx')]),
    ...prefix('/academics', [route('/', 'routes/academics/index.tsx')]),
    ...prefix('/reservations', [route('/', 'routes/reservations/index.tsx')]),
    route('/10-10-project', 'routes/10-10-project/index.tsx'),
    route('*', 'routes/404.tsx'),
  ];
};

export default [
  layout('routes/layout.tsx', [
    ...getLocaleRoutes('ko'),
    ...prefix('/en', [...getLocaleRoutes('en')]),
  ]),
] satisfies RouteConfig;
