// 클라이언트 안전한 CSP 유틸/타입만 둔다(무거운 deps 없음).
// HTML 변환(cheerio·autolinker)은 processHtmlForCsp.ts(serverFn, handler 안 dynamic import)에 있어
// 라우트 loader가 클라에서 실행돼도 cheerio가 클라 번들에 들어가지 않게 한다.

/** 16바이트 랜덤 hex(Web Crypto, 서버/클라 공통). */
export const createNonce = () => {
  const arr = new Uint8Array(16);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
};

// ⚠️ `http:` 오리진을 추가하지 않는다. HTTPS 페이지에선 브라우저 혼합 콘텐츠 차단 때문에
// 어차피 로드되지 않는 죽은 항목이면서, 취약점 점검은 CSP에 `http:`가 있으면 중간자 공격에
// 노출된다고 판정한다(2026-08 wscan "부적절한 CSP 설정" 높음 2건 = script-src·img-src의
// http://*.daumcdn.net). 카카오맵 SDK·타일은 https로 정상 동작한다.
export const getCSPHeaders = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://t1.daumcdn.net https://dapi.kakao.com`,
    // 해시는 radix dialog에서 사용하는 react-remove-scroll-bar의 스타일을 사용하기 위함
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com 'sha256-kAApudxpTi9mfjlC9lC8ZaS9xFHU9/NLLbB173MU7SU=' https://cdn.jsdelivr.net/gh/orioncactus/`,
    "img-src 'self' https://cse.snu.ac.kr https://mts.daumcdn.net https://t1.daumcdn.net",
    "font-src 'self' https://cdn.jsdelivr.net",
    "connect-src 'self' https://cdn.jsdelivr.net",
  ]
    .join('; ')
    .trim();

export interface ProcessedHtml {
  html: string;
  cssRules: string;
  styleKey: string;
}
