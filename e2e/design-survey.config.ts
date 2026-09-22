import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';

// 조사용 캡처. 기존 회귀 기준을 갱신하거나 기본 E2E 실행에 포함하지 않는다.
export default defineConfig({
  ...base,
  testDir: './design-survey',
  globalSetup: './tests/setup/global-setup.ts',
  reporter: [['list']],
  retries: 0,
  workers: 1,
  timeout: 180_000,
  projects: [
    {
      name: 'survey',
      use: { ...devices['Desktop Chrome'], timezoneId: 'Asia/Seoul' },
    },
  ],
});
