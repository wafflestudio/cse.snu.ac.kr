import { createServerFn } from '@tanstack/react-start';
import type { ProcessedHtml } from './csp';

// loader가 isomorphic이라 SPA 네비게이션 때 클라에서도 실행된다. cheerio(+htmlparser2·
// css-select·entities, 클라 ~325KB gzip)를 클라 번들에서 빼려면 변환을 서버 전용 경계
// (createServerFn) 안에서만 돌려야 한다. handler 본문은 빌드 시 클라 번들에서 stripped 되고,
// cheerio는 handler 내부 dynamic import로만 참조해 클라 모듈 그래프에 아예 올라오지 않는다.
// (SSR 첫 진입은 in-process 실행이라 왕복 없음. SPA 네비 때만 서버로 RPC.)
const processHtmlForCspFn = createServerFn({ method: 'POST' })
  .validator((html: string) => html)
  .handler(async ({ data }) => {
    const { processHtmlForCsp } = await import('./processHtmlForCsp');
    return processHtmlForCsp(data);
  });

/** loader에서 호출하는 서버 전용 HTML 변환. `await processHtmlForCsp(html)`. */
export const processHtmlForCsp = (html: string): Promise<ProcessedHtml> =>
  processHtmlForCspFn({ data: html });
