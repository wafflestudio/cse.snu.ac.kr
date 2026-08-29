import { defineConfig, devices } from '@playwright/test';

// E2E는 로컬 docker 백엔드를 띄워 검증합니다.

const APP_URL = 'http://localhost:3000';
const BACKEND_URL = process.env.E2E_BACKEND_URL ?? 'http://localhost:8080';

export default defineConfig({
  testDir: './tests',
  forbidOnly: true,
  reporter: 'html', // 실패 시 playwright-report/ — 스크린샷 diff·trace 열람

  // 타임아웃은 기본값(테스트 30s·단언 5s), 워커 4 — 2026-08-29 실측으로 확정: retries 0으로
  // 전수 6런(w2×3·w4×3) 중 flake 1회뿐이라 과거의 "경합 헤드룸"(60s/10s·워커1)은 낡은 값.
  // 드문 경합 flake(directions 등)는 retries가 흡수하고 trace가 포렌식을 남긴다.
  retries: 2, // flow 고유 이름(Date.now())으로 재시도 충돌 회피
  workers: 4, // 스위트 2.5m(w1) → ~1m

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
