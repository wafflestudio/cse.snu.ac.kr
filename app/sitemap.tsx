import type { LoaderFunctionArgs } from 'react-router';

import { type NavItem, navigationTree } from '~/constants/navigation';

const EXTRA_PATHS = [
  '/',
  '/search',
  '/10-10-project',
  '/10-10-project/proposal',
  '/10-10-project/manager',
  '/10-10-project/participants',
  '/reservations/privacy-policy',
];

const LOCALES = ['', '/en'];

function normalizePath(path: string): string {
  if (!path.startsWith('/')) return `/${path}`;
  if (path === '/') return path;
  return path.replace(/\/+$/, '');
}

function collectPaths(nodes: NavItem[], set: Set<string>) {
  for (const node of nodes) {
    if (node.path) set.add(normalizePath(node.path));
    if (node.children) collectPaths(node.children, set);
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function loader({ request }: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;
  const paths = new Set<string>();

  collectPaths(navigationTree, paths);
  for (const extraPath of EXTRA_PATHS) {
    paths.add(normalizePath(extraPath));
  }

  const localizedPaths = Array.from(paths).flatMap((path) =>
    LOCALES.map((localePrefix) => {
      if (path === '/') return localePrefix || '/';
      return `${localePrefix}${path}`;
    }),
  );

  const urls = localizedPaths
    .sort()
    .map((path) => `  <url><loc>${escapeXml(`${origin}${path}`)}</loc></url>`)
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
    },
  });
}
