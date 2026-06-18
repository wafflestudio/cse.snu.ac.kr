import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/tanstack-react';
import tailwindcss from '@tailwindcss/vite';

const serverFnsMock = fileURLToPath(
  new URL('./serverFns.mock.ts', import.meta.url),
);

const config: StorybookConfig = {
  stories: ['../app/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/tanstack-react',
  // `~/lib/serverFns`(createServerFn 기반)는 SB 브라우저 환경에서 `.validator` 체인이
  // 깨져 useLanguage 사용 컴포넌트의 렌더를 막는다 → SB에선 no-op 모킹으로 alias.
  // (idiomatic `sb.mock`은 addon-vitest 인프라를 요구하는데, 그 의존이 playwright@1.60을
  //  끌어와 앱 E2E(@playwright/test@1.57)와 충돌 → addon-vitest 미설치라 Vite alias로 대체.)
  viteFinal: async (cfg) => {
    cfg.resolve = cfg.resolve ?? {};
    const alias = cfg.resolve.alias;
    if (Array.isArray(alias)) {
      alias.unshift({ find: '~/lib/serverFns', replacement: serverFnsMock });
    } else {
      cfg.resolve.alias = {
        '~/lib/serverFns': serverFnsMock,
        ...(alias ?? {}),
      };
    }
    // Tailwind v4는 전용 Vite 플러그인이 있어야 app.css의 @import "tailwindcss"·@theme·@apply가
    // 컴파일된다. SB는 앱 vite.config를 안 쓰므로 여기서 직접 추가(없으면 스타일 미적용).
    cfg.plugins = [...(cfg.plugins ?? []), tailwindcss()];
    return cfg;
  },
};
export default config;
