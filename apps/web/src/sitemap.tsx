import { BASE_URL } from '@/constants/api';
import {
  type NavItem,
  type NavPath,
  navigationTree,
} from '@/constants/navigation';
import type { Res } from '@/types/api/helpers';

// /sitemap.xml 은 인덱스, 실제 URL 은 /sitemap/<파일>.xml 에 유형별로 나눈다.
// 정적 페이지는 내비게이션 트리에서, 콘텐츠 상세는 백엔드 /api/v2/sitemap(id·수정 시각)에서 만든다.
// 공지·새소식·세미나는 언어 필드가 없어 /en 도 같은 본문이라 /ko 만 넣는다(둘 다 넣으면 같은 내용의
// URL 3만 개가 중복 판정을 받는다). 번역이 실제로 있는 정적 페이지·교수·연구실만 두 로케일.

type SitemapData = Res<'/api/v2/sitemap'>;
type Entry = SitemapData['notice'][number];

// 내비에 없는 수록 대상. NavPath라 라우트가 사라지면 컴파일 에러.
const EXTRA_PATHS: NavPath[] = [
  '/',
  '/search',
  '/10-10-project',
  '/10-10-project/proposal',
  '/10-10-project/manager',
  '/10-10-project/participants',
  '/reservations/privacy-policy',
];

const LOCALES = ['/ko', '/en'];

const SECTIONS = [
  'pages',
  'notice',
  'news',
  'seminar',
  'people',
  'research',
] as const;
type Section = (typeof SECTIONS)[number];

const CACHE_TTL_MS = 60 * 60 * 1000;
let cache: { at: number; data: Promise<SitemapData> } | null = null;

// 백엔드 응답을 프로세스 안에 1시간 둔다. 크롤러가 인덱스와 파일 여섯 개를 잇따라 부르는데
// 매번 1.4만 행을 다시 받을 이유가 없다. 실패는 캐시하지 않는다.
function loadData(): Promise<SitemapData> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;
  const data = fetch(`${BASE_URL}/v2/sitemap`).then((res) => {
    if (!res.ok) throw new Error(`sitemap data ${res.status}`);
    return res.json() as Promise<SitemapData>;
  });
  cache = { at: Date.now(), data };
  data.catch(() => {
    cache = null;
  });
  return data;
}

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

// 백엔드가 수정 시각을 ISO instant("…Z") 로 준다 — W3C datetime 이라 그대로 lastmod 에 쓴다.
// 컬럼 기본값 1999-01-01 은 "모름"이라 빼는데, 틀린 lastmod 를 주면 검색엔진이 사이트맵의 lastmod 전체를 무시한다.
function lastmod(modifiedAt: string | null | undefined): string | undefined {
  if (!modifiedAt || modifiedAt < '2000') return undefined;
  return modifiedAt;
}

type Url = { path: string; lastmod?: string };

function localized(path: string): string[] {
  return LOCALES.map((prefix) => (path === '/' ? prefix : `${prefix}${path}`));
}

function detailUrls(entries: Entry[], base: string, locales: string[]): Url[] {
  return entries.flatMap((e) =>
    locales.map((prefix) => ({
      path: `${prefix}${base}/${e.id}`,
      lastmod: lastmod(e.modifiedAt),
    })),
  );
}

async function sectionUrls(section: Section): Promise<Url[]> {
  if (section === 'pages') {
    const paths = new Set<string>();
    collectPaths(navigationTree, paths);
    for (const p of EXTRA_PATHS) paths.add(normalizePath(p));
    return Array.from(paths)
      .flatMap(localized)
      .sort()
      .map((path) => ({ path }));
  }
  const data = await loadData();
  switch (section) {
    case 'notice':
      return detailUrls(data.notice, '/community/notice', ['/ko']);
    case 'news':
      return detailUrls(data.news, '/community/news', ['/ko']);
    case 'seminar':
      return detailUrls(data.seminar, '/community/seminar', ['/ko']);
    case 'people':
      return [
        ...detailUrls(data.professor, '/people/faculty', LOCALES),
        ...detailUrls(
          data.emeritusProfessor,
          '/people/emeritus-faculty',
          LOCALES,
        ),
        ...detailUrls(data.staff, '/people/staff', LOCALES),
      ];
    case 'research':
      return detailUrls(data.lab, '/research/labs', LOCALES);
  }
}

// 컨테이너 앞에서 Caddy 가 TLS 를 끝내므로 request.url 은 http:// 다. 프록시가 붙인 헤더로 공개 주소를 만든다.
// 헤더가 없으면(로컬·E2E) 요청 URL 그대로.
function publicOrigin(request: Request): string {
  const url = new URL(request.url);
  const proto =
    request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '');
  const host =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    url.host;
  return `${proto}://${host}`;
}

function xmlResponse(body: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/** /sitemap.xml — 유형별 파일을 가리키는 인덱스. */
export async function handleSitemapIndex(request: Request): Promise<Response> {
  const origin = publicOrigin(request);
  const items = SECTIONS.map(
    (s) => `  <sitemap><loc>${origin}/sitemap/${s}.xml</loc></sitemap>`,
  ).join('\n');
  return xmlResponse(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`,
  );
}

/** /sitemap/<section>.xml */
export async function handleSitemapSection(
  request: Request,
  file: string,
): Promise<Response> {
  const section = SECTIONS.find((s) => `${s}.xml` === file);
  if (!section) return new Response('Not Found', { status: 404 });

  const origin = publicOrigin(request);
  const urls = (await sectionUrls(section))
    .map(
      ({ path, lastmod }) =>
        `  <url><loc>${escapeXml(`${origin}${path}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
    )
    .join('\n');
  return xmlResponse(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
}
