import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const API_BASE_URL_BY_MODE: Record<string, string> = {
  production: 'https://cse.snu.ac.kr',
  staging: 'https://168.107.16.249.nip.io',
  development: 'https://168.107.16.249.nip.io',
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'env');
  const apiBaseUrl =
    env.VITE_API_BASE_URL ||
    API_BASE_URL_BY_MODE[mode] ||
    API_BASE_URL_BY_MODE.production;

  return {
    envDir: 'env',
    // 앱(api.ts)이 읽을 백엔드 base URL 주입.
    define: { __API_BASE_URL__: JSON.stringify(apiBaseUrl) },
    plugins: [
      tailwindcss(),
      tanstackStart({
        srcDirectory: 'app',
        router: {
          routesDirectory: 'routes',
          generatedRouteTree: 'routeTree.gen.ts',
          // 라우트 디렉터리에 함께 둔 비라우트 파일을 라우트로 오인하지 않게 무시:
          // PascalCase(컴포넌트), components/sections/hooks 디렉터리, 그리고 라우트 옆 소문자
          // 헬퍼(api/constants/fetchContent.ts). 실제 라우트는 index/$/route/페이지명뿐.
          routeFileIgnorePattern:
            'components|sections|(^|/)[A-Z]|(^|/)use[A-Z]|(^|/)(api|constants|fetchContent)\\.tsx?$',
        },
      }),
      // react plugin은 start plugin 뒤에 와야 함
      viteReact(),
      tsconfigPaths(),
      svgr(),
      // 번들 분석: ANALYZE=1 일 때만. 클라 청크 treemap을 dist/stats.html로.
      ...(process.env.ANALYZE
        ? [
            visualizer({
              filename: 'dist/stats.html',
              gzipSize: true,
              brotliSize: true,
              template: 'treemap',
            }),
          ]
        : []),
    ],
    server: {
      // 카맵 api가 3000번만 열려있는듯
      port: 3000,
      proxy: {
        '/api': {
          target: apiBaseUrl,
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
      // https://vite.dev/guide/features#data
      assetsInlineLimit: 0,
    },
  };
});
