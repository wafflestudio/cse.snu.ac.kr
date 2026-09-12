import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
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
      assetsInlineLimit: 0,
    },
  };
});
