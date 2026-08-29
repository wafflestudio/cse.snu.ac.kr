const PHASE = import.meta.env.MODE;

export const IS_DEV = import.meta.env.DEV;
export const IS_STAGING = PHASE === 'staging';
export const IS_PROD = PHASE === 'production';

// 바라볼 백엔드는 vite.config가 mode로 정해 __API_BASE_URL__로 주입한다(단일 출처).
// dev는 CORS 회피 위해 vite 프록시(localhost:3000/api)를 경유한다.
export const BASE_URL = IS_DEV
  ? 'http://localhost:3000/api'
  : `${__API_BASE_URL__}/api`;
