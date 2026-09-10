# 컨텍스트 = 레포 루트(pnpm 워크스페이스 lockfile 이 거기 있다). 호출: docker build -f apps/web/Dockerfile <루트>
FROM node:24.20.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# 워크스페이스 매니페스트만 먼저 — 소스가 바뀌어도 설치 레이어는 캐시된다.
FROM base AS manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/

FROM manifests AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --filter web

FROM manifests AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter web
ARG BUILD_MODE=production
ARG VITE_KAKAO_MAP_API_KEY
COPY apps/web apps/web
RUN if [ "$BUILD_MODE" = "staging" ]; then pnpm --filter web build:staging; else pnpm --filter web build; fi

FROM base
ENV TZ=Asia/Seoul
COPY package.json pnpm-workspace.yaml ./
COPY apps/web /app/apps/web
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=prod-deps /app/apps/web/node_modules /app/apps/web/node_modules
COPY --from=build /app/apps/web/dist /app/apps/web/dist
WORKDIR /app/apps/web
CMD [ "pnpm", "start" ]
