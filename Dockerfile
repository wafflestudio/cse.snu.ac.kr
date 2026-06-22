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
# CSP 정책을 csp.ts에서 nginx include로 생성(단일 출처).
RUN pnpm exec tsx scripts/gen-nginx-csp.ts > nginx/csp.conf

FROM base
ENV TZ=Asia/Seoul
# 엣지 nginx(ISR 캐시·nonce 재주입). 워커가 쓸 캐시·pid 디렉터리 준비.
RUN apk add --no-cache nginx \
  && mkdir -p /run/nginx /var/cache/nginx/app \
  && chown -R nginx:nginx /run/nginx /var/cache/nginx
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/storybook-static /app/storybook-static
COPY --from=build /app/nginx/csp.conf /etc/nginx/csp.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
# nginx(:3000 공개) + Hono(:8787, BEHIND_NGINX) 동시 기동. prod는 API_PROXY_TARGET 미설정.
CMD [ "sh", "/app/docker-entrypoint.sh" ]
