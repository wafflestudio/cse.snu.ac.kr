import { layout, type RouteConfig, route } from '@react-router/dev/routes';

export default [
  layout('routes/[locale]/layout.tsx', [
    route(':locale', 'routes/[locale]/index.tsx'),
  ]),
] satisfies RouteConfig;
