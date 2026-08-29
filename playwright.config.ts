import { defineConfig, devices } from '@playwright/test';

// E2E는 로컬 docker 백엔드를 띄워 검증합니다.

const APP_URL = 'http://localhost:3000';
const BACKEND_URL = process.env.E2E_BACKEND_URL ?? 'http://localhost:8080';

export default defineConfig({
  testDir: './tests',
  forbidOnly: true,
  reporter: 'html', // 실패 시 playwright-report/ — 스크린샷 diff·trace 열람

  retries: 2,
  // CI 러너는 로컬보다 느려 타임아웃 실패(PR #20) → 보수 분기. CI=1은 우리가 항상 넣으므로 신호는 GITHUB_ACTIONS.
  timeout: process.env.GITHUB_ACTIONS ? 60_000 : 30_000,
  expect: { timeout: process.env.GITHUB_ACTIONS ? 10_000 : 5_000 },
  workers: process.env.GITHUB_ACTIONS ? 1 : 4,

  use: {
    baseURL: APP_URL,
    trace: 'on-first-retry',
  },

  // 매 런 1회: DB 리셋 + 결정론적 baseline 시드.
  globalSetup: './tests/setup/global-setup.ts',

  // read(비로그인·비변경) → flow(로그인·DB 변경) 순서를 project dependency로 보장한다.
  // language·security는 DB 비변경이라 read 단계에서 병렬로 돌고 flow의 선행이다.
  projects: [
    {
      name: 'read',
      testMatch: /read\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'read-mobile',
      testMatch: /read\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      // 로케일 라우팅(리다이렉트·우선순위·토글·hreflang). 모바일 토글은 스펙 내부 test.use.
      name: 'language',
      testMatch: /language\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // 취약점 점검(wscan) 회귀 가드 — 상태 코드·보안 헤더. 렌더가 아니라 HTTP 응답만 본다.
      name: 'security',
      testMatch: /security\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'flow',
      testMatch: /flow\.spec\.ts$/,
      dependencies: ['read', 'read-mobile', 'language', 'security'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: `pnpm build:local && PORT=3000 API_PROXY_TARGET=${BACKEND_URL} tsx server.ts`,
    url: `${APP_URL}/research/labs`,
    // 매 런 새 컨테이너에서 새로 빌드(현재 소스 검증). 컨테이너 안 :3000이라 충돌 없음.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
