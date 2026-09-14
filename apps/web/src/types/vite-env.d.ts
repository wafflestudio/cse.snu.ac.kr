/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_MAP_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// GoatCounter count.js 가 노출하는 전역(prod 에서만 로드된다).
interface Window {
  goatcounter?: {
    count: (vars?: { path?: string; title?: string; event?: boolean }) => void;
  };
}
