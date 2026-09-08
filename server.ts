import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { prometheus } from '@hono/prometheus';
import { type Context, Hono } from 'hono';
import { compress } from 'hono/compress';
import { proxy } from 'hono/proxy';

// 빌드(`dist/`)를 서빙하는 Node 서버. prod·staging 컨테이너와 E2E가 공유(같은 이미지).
// dist/server/server.js는 Web fetch 핸들러 → Hono가 Node↔Web 변환을 맡는다.
const PORT = Number(process.env.PORT) || 3000;
const METRICS_PORT = Number(process.env.METRICS_PORT) || 9464;
const API_PROXY_TARGET = process.env.API_PROXY_TARGET ?? null;

// @ts-expect-error 빌드 산출물엔 타입 선언 없음
const mod = await import('./dist/server/server.js');
const handler: { fetch: (req: Request) => Promise<Response> } = mod.default;

// page 라벨 값은 유한해야 한다. 숫자 id 는 접고, 봇 스캔 경로는 상태 코드로 막는다.
const pageLabel = (c: Context) => {
  const path = c.req.path;
  if (path.startsWith('/assets/')) return '/assets/*';
  if (path.startsWith('/api/')) return '/api/*';
  const { status } = c.res;
  if (status >= 300 && status < 400) return '(redirect)';
  if (status >= 400 && status < 500) return '(not-found)';
  return (
    path.replace(/^\/(ko|en)(?=\/|$)/, '').replace(/\/\d+(?=\/|$)/g, '/:id') ||
    '/'
  );
};
const customLabels = { page: pageLabel };
const { printMetrics, registerMetrics } = prometheus({
  collectDefaultMetrics: true,
  metricOptions: {
    requestDuration: { customLabels },
    requestsTotal: { customLabels },
  },
});

const app = new Hono();
app.use('*', registerMetrics);
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

app.use('/*', serveStatic({ root: './dist/client' })); // 정적; 없으면 next()
app.all('*', (c) => handler.fetch(c.req.raw)); // SSR + server route(/img·/sitemap.xml)

// :PORT 는 Caddy catch-all 로 공개되는 포트라 /metrics 를 거기 두지 않는다.
serve({
  fetch: new Hono().get('/metrics', printMetrics).fetch,
  port: METRICS_PORT,
});
serve({ fetch: app.fetch, port: PORT }, (info) => {
  const note = API_PROXY_TARGET
    ? `/api 프록시(${API_PROXY_TARGET})`
    : '/api 프록시 없음(절대 URL 직호출)';
  console.log(
    `[server] prod 빌드 서빙 + ${note} → :${info.port} (metrics :${METRICS_PORT})`,
  );
});
