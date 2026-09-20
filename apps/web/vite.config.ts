import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    envDir: 'env',
    plugins: [
      tailwindcss(),
      // react plugin 보다 앞서야 .mdx 가 JSX 로 바뀐 뒤 변환된다.
      // 표는 디자인 시스템 문서가 값을 늘어놓을 때 쓴다 — 기본 MDX 는 표를 모른다.
      { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm] }) },
      tanstackStart({
        router: {
          routesDirectory: 'routes',
          generatedRouteTree: 'routeTree.gen.ts',
        },
      }),
      // react plugin은 start plugin 뒤에 와야 함
      viteReact(),
      tsconfigPaths(),
      svgr(),
    ],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: process.env.API_ORIGIN, // dev 스크립트가 준다
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin'); // 서버에서 내려오는 CORS 에러 방지
            });
          },
        },
      },
    },
    build: {
      // CSP 관련 (data URI 인라인 방지)
      assetsInlineLimit: 0,
    },
  };
});
