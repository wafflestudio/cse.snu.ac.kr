import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { proxy } from 'hono/proxy';

// 빌드(`dist/`)를 서빙하는 Node 서버. prod·staging 컨테이너와 E2E가 공유(같은 이미지).
// dist/server/server.js는 Web fetch 핸들러 → Hono가 Node↔Web 변환을 맡는다.
const PORT = Number(process.env.PORT) || 3000;
const API_PROXY_TARGET = process.env.API_PROXY_TARGET ?? null;

// @ts-expect-error 빌드 산출물엔 타입 선언 없음
const mod = await import('./dist/server/server.js');
const handler: { fetch: (req: Request) => Promise<Response> } =
  mod.default ?? mod;

const app = new Hono();

// SSR HTML·JS·CSS gzip 압축(비압축이면 느린망에서 FCP/LCP 지배). staging Caddy엔 encode 없어 여기서.
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

serve({ fetch: app.fetch, port: PORT }, (info) => {
  const note = API_PROXY_TARGET
    ? `/api 프록시(${API_PROXY_TARGET})`
    : '/api 프록시 없음(절대 URL 직호출)';
  console.log(`[server] prod 빌드 서빙 + ${note} → :${info.port}`);
});
