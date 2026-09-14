const PHASE = import.meta.env.MODE;

export const IS_DEV = import.meta.env.DEV;
export const IS_STAGING = PHASE === 'staging';
export const IS_PROD = PHASE === 'production';
// 브라우저는 same-origin `/api` — 세션 쿠키가 first-party로 유지되고 CORS를 안 탄다.
// SSR은 상대 경로를 못 쓰니 절대 URL이고, 그 오리진은 서버 런타임 env로 받는다(빌드에 박지 않는다).
export const BASE_URL = import.meta.env.SSR
  ? `${process.env.API_ORIGIN}/api`
  : '/api';
