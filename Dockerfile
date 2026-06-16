FROM node:24-alpine AS base
ENV CI=true
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
ARG BUILD_MODE=production
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# TanStack Start(vite) 빌드 → dist/client + dist/server/server.js (mode로 env/.env.<mode> 로드)
RUN pnpm exec vite build --mode ${BUILD_MODE}
# 컴포넌트 카탈로그(storybook-static) → server.ts가 /storybook으로 서빙
RUN pnpm build-storybook

FROM base
ENV TZ=Asia/Seoul
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/storybook-static /app/storybook-static
# pnpm start = tsx server.ts: dist/ + /storybook 서빙. prod는 API_PROXY_TARGET 미설정 → 절대 URL 직호출.
CMD [ "pnpm", "start" ]
