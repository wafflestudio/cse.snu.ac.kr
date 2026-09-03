const PHASE = import.meta.env.MODE;

export const IS_DEV = import.meta.env.DEV;
export const IS_STAGING = PHASE === 'staging';
export const IS_PROD = PHASE === 'production';

// 바라볼 백엔드는 vite.config가 mode로 정해 __API_BASE_URL__로 주입한다(단일 출처).
// 브라우저는 same-origin `/api`(dev=vite 프록시, prod=동일 도메인, E2E=server.ts 프록시)
// — 세션 쿠키가 first-party로 유지되고 CORS를 안 탄다. SSR은 상대 경로를 못 쓰니 절대 URL.
export const BASE_URL = import.meta.env.SSR
  ? `${__API_BASE_URL__}/api`
  : '/api';
