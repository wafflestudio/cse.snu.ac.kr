/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_MAP_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// vite.config가 mode로 정한 백엔드 base URL(define 주입).
declare const __API_BASE_URL__: string;
declare const __STATS_ENABLED__: boolean;

// GoatCounter count.js 가 노출하는 전역(prod 에서만 로드된다).
interface Window {
  goatcounter?: {
    count: (vars?: { path?: string; title?: string; event?: boolean }) => void;
  };
}
