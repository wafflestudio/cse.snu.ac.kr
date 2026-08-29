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
# 카맵키는 build-arg로 주입(git clone 컨텍스트엔 env/.env가 없다). API URL은 package.json에 인라인(공개값).
ARG VITE_KAKAO_MAP_API_KEY
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN if [ "$BUILD_MODE" = "staging" ]; then pnpm build:staging; else pnpm build; fi

FROM base
ENV TZ=Asia/Seoul
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
# pnpm start = tsx server.ts: dist/ 서빙. prod는 API_PROXY_TARGET 미설정 → 절대 URL 직호출.
# (Storybook은 로컬 전용 `pnpm storybook` — 배포 이미지엔 안 넣는다.)
CMD [ "pnpm", "start" ]
