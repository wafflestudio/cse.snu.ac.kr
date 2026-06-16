import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * E2E는 로컬 docker 백엔드(csereal-server, local 프로파일)를 실서버로 띄워 검증합니다.
 * - mock 없이 진짜 백엔드(multipart·세션·영속성)를 사용 → flow를 stateful하게 검증.
 * - globalSetup이 매 런 DB를 리셋하고 결정론적 baseline을 시드합니다.
 * - 앱은 프로덕션 빌드를 same-origin proxy 서버(루트 server.ts, prod와 공유)로 서빙합니다.
 *   브라우저는 :3000만 호출하고 /api는 서버사이드에서 :8080으로 프록시되므로, 실서버
 *   세션 쿠키(Secure)가 first-party로 유지됩니다. → 앱 CSP/CORS 수정 불필요, 콜드 컴파일 없음.
 * - 절대 staging/프로덕션 서버를 건드리지 않습니다(로컬 docker 전용).
 */
const BACKEND_URL = process.env.E2E_BACKEND_URL ?? 'http://localhost:8080';
const APP_URL = 'http://localhost:3000';
const BACKEND_DIR = path.resolve(here, '../csereal-server');

const backendServer = {
  command: `docker compose -f ${BACKEND_DIR}/docker-compose-local-full.yml -f ${BACKEND_DIR}/docker-compose-fe-test.yml up -d`,
  url: `${BACKEND_URL}/api/v2/research/lab?language=ko`,
  reuseExistingServer: true,
  timeout: 180_000,
};

const appServer = {
  // BASE_URL을 :3000/api로 빌드(local) → 브라우저는 same-origin, server.ts가 /api를 :8080으로 프록시
  command: `pnpm build:local && PORT=3000 API_PROXY_TARGET=${BACKEND_URL} tsx server.ts`,
  url: `${APP_URL}/research/labs`,
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
};

export default defineConfig({
  testDir: './tests',
  // 테스트 타임아웃 헤드룸: 단일 docker 백엔드 경합 시 heavy multipart 생성(research/labs PI+
  // PDF 등)이 기본 30s를 간헐적으로 초과(앱은 정상, 결과는 결국 반영 — 실서버 지연). 60s로 완화.
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // 로컬은 retries 0: flow는 stateful(고정 연도 등)이라 실패한 시도가 데이터를 남겨 재시도가
  // 오히려 충돌한다(idempotent하지 않음). 경합 flaky는 워커 수로 낮춘다. CI는 1워커+retries.
  retries: process.env.CI ? 2 : 0,
  // 단일 docker 백엔드(MySQL+Spring) 경합 방지: 워커를 2로 낮춰 동시 mutation 부하를 줄인다
  // (TanStack은 클라에서 페이지 로더를 돌려 RR보다 경합에 민감 → labs multipart 등이 30s 초과).
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',

  // 병렬 flow가 단일 docker 백엔드를 경합시켜 mutation 후 네비게이션 로더가 간헐적으로
  // 5초(기본 expect 타임아웃)를 넘길 수 있다. TanStack은 클라이언트에서 페이지 로더를
  // 돌려(RR의 서버 single-fetch와 타이밍이 달라) 경합 시 살짝 더 느릴 수 있으므로 단언
  // 타임아웃에 헤드룸을 둔다(앱은 정상 동작 — 결과는 결국 반영됨).
  expect: { timeout: 10_000 },

  use: {
    baseURL: APP_URL,
    trace: 'on-first-retry',
  },

  /* 매 런 1회: DB 리셋 + baseline 시드 */
  globalSetup: './tests/setup/global-setup.ts',

  /*
   * read(읽기) → flow(변경) 순서 보장.
   * read.spec.ts(비로그인·비변경)는 데스크톱(read)과 모바일 390px(read-mobile)에서
   * 같은 스펙을 돌려 baseline을 자동 분리합니다(`*-read-darwin.png` / `*-read-mobile-darwin.png`).
   * flow가 DB를 변경하므로, read가 깨끗한 baseline을 먼저 검증한 뒤 flow가 실행되도록
   * project dependency로 분리합니다(데스크톱 전용).
   */
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
      name: 'flow',
      testMatch: /flow\.spec\.ts$/,
      dependencies: ['read', 'read-mobile'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [backendServer, appServer],
});
