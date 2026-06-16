import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  // Load env file based on mode from env/ directory
  const env = loadEnv(mode, 'env');
  const API_TARGET = env.VITE_API_BASE_URL;

  return {
    envDir: 'env',
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
    ],
    server: {
      // 카맵 api가 3000번만 열려있는듯
      port: 3000,
      proxy: {
        '/api': {
          target: API_TARGET,
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
