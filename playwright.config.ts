import { defineConfig, devices } from '@playwright/test';

// E2E는 로컬 docker 백엔드를 띄워 검증합니다.

const APP_URL = 'http://localhost:3000';
const BACKEND_URL = process.env.E2E_BACKEND_URL ?? 'http://localhost:8080';

export default defineConfig({
  testDir: './tests',
  forbidOnly: true,
  reporter: 'html', // 실패 시 playwright-report/ (CI는 아티팩트 업로드)

  // 단일 docker 백엔드(MySQL+Spring)는 병렬 mutation 경합에 민감하고 flow가 stateful이라
  // 워커 1 직렬 실행. 그래도 heavy multipart 생성(labs PI+PDF 등)·mutation 후 로더가 느릴
  // 수 있어(앱은 정상 — 결과는 결국 반영) 타임아웃에 여유. TanStack은 페이지 로더를 클라에서
  // 돌려 RR의 서버 single-fetch보다 경합에 더 민감하다.
  timeout: 60_000, // 테스트 전체(기본 30s)
  expect: { timeout: 10_000 }, // 단언(기본 5s)
  retries: 2, // flow 고유 이름(Date.now())으로 재시도 충돌 회피
  workers: 1,

  use: {
    baseURL: APP_URL,
    trace: 'on-first-retry',
  },

  // 매 런 1회: DB 리셋 + 결정론적 baseline 시드.
  globalSetup: './tests/setup/global-setup.ts',

  // read(비로그인·비변경) → flow(로그인·DB 변경) 순서를 project dependency로 보장한다.
  // read.spec.ts는 데스크톱(read)·모바일 390px(read-mobile)에서 같은 스펙을 돌려 baseline을
  // 자동 분리한다(*-read-linux.png / *-read-mobile-linux.png — 핀 컨테이너가 정본 렌더 환경이라
  // Linux 단일). language·security는 DB 비변경이라 read 단계에서 병렬로 돌고 flow의 선행이다.
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
    // build:local → BASE_URL=:3000/api(브라우저 same-origin), server.ts가 /api를 :8080으로 프록시.
    command: `pnpm build:local && PORT=3000 API_PROXY_TARGET=${BACKEND_URL} tsx server.ts`,
    url: `${APP_URL}/research/labs`,
    // 매 런 새 컨테이너에서 새로 빌드(현재 소스 검증). 컨테이너 안 :3000이라 충돌 없음.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
