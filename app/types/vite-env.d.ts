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
