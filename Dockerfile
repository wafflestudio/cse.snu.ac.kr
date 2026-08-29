FROM node:24.20.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# 의존성 설치를 소스 COPY 전에 두어 lockfile류에만 의존하게 한다 → deps 안 바뀐 배포는
# install 레이어가 캐시 히트로 스킵된다. pnpm-workspace.yaml의 onlyBuiltDependencies
# (esbuild·sharp 네이티브 빌드 승인)도 install에 필요하므로 함께 COPY.
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG BUILD_MODE=production
# 카맵키는 build-arg로 주입(git clone 컨텍스트엔 env/.env가 없다). API URL은 package.json에 인라인(공개값).
ARG VITE_KAKAO_MAP_API_KEY
COPY . .
RUN if [ "$BUILD_MODE" = "staging" ]; then pnpm build:staging; else pnpm build; fi

FROM base
ENV TZ=Asia/Seoul
COPY . /app
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
# pnpm start = tsx server.ts: dist/ 서빙. prod는 API_PROXY_TARGET 미설정 → 절대 URL 직호출.
CMD [ "pnpm", "start" ]
