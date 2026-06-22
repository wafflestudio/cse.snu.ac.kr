import { purgeCache } from '@/utils/serverFns';

/**
 * 현재 페이지 경로에서 무효화할 캐시 섹션을 도출한다(로케일 + 후행 id/edit/create/연도 제거).
 * 예: `/ko/community/notice/edit/123` → `/community/notice`. admin은 영향 범위가 넓어 `*`(flush-all).
 * 서버(window 없음)에선 '' 반환 → purge 생략.
 */
function purgeScopeFromLocation(): string {
  if (typeof window === 'undefined') return '';
  const path = window.location.pathname.replace(/^\/(ko|en)/, '') || '/';
  if (path === '/admin' || path.startsWith('/admin/')) return '*';
  const segs = path.split('/').filter(Boolean);
  while (segs.length && /^(\d+|edit|create)$/.test(segs[segs.length - 1])) {
    segs.pop();
  }
  return `/${segs.join('/')}`;
}

/**
 * HTTP 상태 코드가 200대가 아니면 에러를 throw하는 fetch wrapper
 */
export async function fetchOk(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const url = input instanceof Request ? input.url : String(input);
    throw new Error(
      `HTTP Error: ${response.status} ${response.statusText} (URL: ${url})`,
    );
  }

  // 성공한 mutation(POST/PUT/DELETE/PATCH) 후 해당 섹션 ISR 캐시 무효화(fire-and-forget).
  // serverFn이 BEHIND_NGINX·로그인 세션을 확인 → 로컬·E2E·비로그인은 no-op.
  const method = (init?.method ?? 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') {
    const scope = purgeScopeFromLocation();
    if (scope) void purgeCache({ data: { scope } }).catch(() => {});
  }

  return response;
}

/**
 * fetch를 실행하고 자동으로 JSON 파싱하는 함수
 * 200대가 아니면 에러를 throw
 */
export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetchOk(input, init);
  // DELETE 등 일부 엔드포인트는 200이지만 본문이 비어 있습니다. 빈 본문을
  // response.json()으로 파싱하면 throw되므로(삭제 성공인데 실패로 처리되는 버그),
  // 본문이 없으면 undefined를 반환합니다.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
