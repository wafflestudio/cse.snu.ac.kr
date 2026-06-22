import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { proxy } from 'hono/proxy';

// prod 빌드(`dist/`)를 서빙하는 Node 서버. prod 컨테이너와 E2E가 공유.
// dist/server/server.js는 Web fetch 핸들러 → Hono가 Node↔Web 변환을 맡는다.
const PORT = Number(process.env.PORT) || 3000;
// /api 프록시 타깃. 설정 시에만 프록시(local/E2E). prod는 미설정 → 절대 URL 직호출.
const API_PROXY_TARGET = process.env.API_PROXY_TARGET ?? null;

// ISR: nginx-fronted 배포(BEHIND_NGINX=1)에서만 HTML 응답에 Cache-Control을 부여한다.
// nginx가 이 헤더로 캐시 여부·TTL을 결정(익명 응답만 저장, JSESSIONID 있으면 우회는 nginx가).
// 게이트 off(dev·E2E preview)면 헤더 미부여 → 현행 동작 유지.
const BEHIND_NGINX = process.env.BEHIND_NGINX === '1';
const NO_STORE_PREFIXES = ['/admin', '/.internal'];
const cacheControlFor = (pathname: string): string =>
  NO_STORE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    ? 'no-store'
    : // s-maxage=공유캐시(nginx) 신선도, SWR=백그라운드 갱신. max-age 미지정(nginx가 max-age=0을
      // no-cache로 해석하는 것 회피; SSR 응답엔 Last-Modified 없어 브라우저 휴리스틱 캐시도 안 됨).
      'public, s-maxage=60, stale-while-revalidate=600';

// @ts-expect-error 빌드 산출물엔 타입 선언 없음
const mod = await import('./dist/server/server.js');
const handler: { fetch: (req: Request) => Promise<Response> } =
  mod.default ?? mod;

const app = new Hono();

// 텍스트 응답(SSR HTML·JS·CSS) gzip 압축. 비압축이면 느린망에서 다운로드가 FCP/LCP를
// 지배(문서 ~320KB·JS ~700KB 비압축이 병목이었음). staging Caddy엔 encode가 없어 여기서 압축.
app.use(compress());

// /api/** → 백엔드 프록시. `raw`로 원본 요청(쿠키 포함)·응답 Set-Cookie 그대로 전달(세션 유지).
if (API_PROXY_TARGET) {
  app.all('/api/*', (c) => {
    const url = new URL(c.req.url);
    return proxy(`${API_PROXY_TARGET}${url.pathname}${url.search}`, {
      raw: c.req.raw,
    });
  });
}

// Storybook 컴포넌트 카탈로그(/storybook). storybook-static의 에셋이 상대경로(`./assets`)라
// 트레일링 슬래시가 있어야 /storybook/ 하위로 올바로 해석된다 → 슬래시 없으면 리다이렉트.
// (storybook-static이 없으면 serveStatic이 next()→404. prod/staging 이미지엔 빌드해 포함.)
app.get('/storybook', (c) => c.redirect('/storybook/'));
app.use(
  '/storybook/*',
  serveStatic({
    root: './storybook-static',
    rewriteRequestPath: (p) => p.replace(/^\/storybook/, '') || '/',
  }),
);

app.use('/*', serveStatic({ root: './dist/client' })); // 정적; 없으면 next()
// SSR + server route(/img·/sitemap.xml). nginx-fronted면 HTML GET 200에 Cache-Control 부여.
app.all('*', async (c) => {
  const res = await handler.fetch(c.req.raw);
  if (!BEHIND_NGINX || c.req.method !== 'GET' || res.status !== 200) return res;
  if (!(res.headers.get('content-type') ?? '').includes('text/html'))
    return res;
  const headers = new Headers(res.headers);
  headers.set('Cache-Control', cacheControlFor(new URL(c.req.url).pathname));
  return new Response(res.body, { status: res.status, headers });
});

serve({ fetch: app.fetch, port: PORT }, (info) => {
  const note = API_PROXY_TARGET
    ? `/api 프록시(${API_PROXY_TARGET})`
    : '/api 프록시 없음(절대 URL 직호출)';
  console.log(`[server] prod 빌드 서빙 + ${note} → :${info.port}`);
});
