import { createServerFn } from '@tanstack/react-start';
import type { ViewerHtml } from '@/utils/csp';
import {
  buildOptimizedUrl,
  isImageProxyHost,
  shouldOptimize,
} from '@/utils/imageUrl';

// 백엔드가 세탁한 본문을 뷰어가 그대로 꽂을 수 있는 모양으로 손질한다.
// - 인라인 style → 요소당 클래스 하나 + cssRules(호출측이 nonce <style>로 주입). strict CSP 는
//   style 속성을 막는다.
// - 본문 <img> 를 /img 프록시로. 대표 이미지(Image 컴포넌트)와 같은 경로를 타게 한다.
// 링크·rel·허용 태그는 백엔드 세탁이 맡는다. 여기서는 규칙을 판단하지 않는다.
//
// cheerio(~300KB gz)는 handler 안 dynamic import로만 참조한다 — 클라 빌드는 handler 본문을
// 스트립하므로 클라 모듈 그래프에 아예 안 올라간다. ⚠️ 로직을 handler 밖 top-level 함수로 빼면
// 이 보장이 깨진다. 호출은 `await prepareHtmlForViewer({ data: html })`.
export const prepareHtmlForViewer = createServerFn({ method: 'POST' })
  .validator((html: string) => html)
  .handler(async ({ data }): Promise<ViewerHtml> => {
    const cheerio = await import('cheerio');
    const $ = cheerio.load(data);

    // 뷰어 CSS(`.sun-editor-editable p` 등)보다 앞서야 인라인 style 이 그랬듯 이긴다.
    // `.sun-editor-editable .cls`(0,2,0) 는 뷰어의 어떤 하위 선택자보다 높다.
    const classByStyle = new Map<string, string>();
    $('[style]').each((_i, el) => {
      const $el = $(el);
      // `{`·`}`·`@`가 든 선언은 버린다 — 아래에서 `.class { ... }` 안에 그대로 넣으므로
      // 규칙 밖으로 탈출해 임의 CSS 를 nonce 달고 주입할 수 있다.
      const declarations = ($el.attr('style') ?? '')
        .split(';')
        .map((d) => d.trim())
        .filter((d) => d.length > 0 && !/[{}@]/.test(d))
        .join('; ');
      $el.removeAttr('style');
      if (!declarations) return;

      let className = classByStyle.get(declarations);
      if (!className) {
        className = `s-${hashStr(declarations)}`;
        classByStyle.set(declarations, className);
      }
      $el.addClass(className);
    });
    const cssRules = Array.from(
      classByStyle,
      ([declarations, className]) =>
        `.sun-editor-editable .${className} { ${declarations} }`,
    ).join('\n');

    $('img[src]').each((_i, el) => {
      const src = $(el).attr('src');
      if (!shouldOptimize(src)) return;
      if (!isImageProxyHost(new URL(src).hostname, import.meta.env.DEV)) return;
      // 본문 폭(~900px)의 2x 를 상한으로. 더 큰 원본은 여기서 줄어든다.
      $(el).attr('src', buildOptimizedUrl(src, 75, 1600));
    });

    return { html: $('body').html() ?? '', cssRules };
  });

/** 결정론적 문자열 해시(FNV-1a 32bit → base36). 같은 style 은 같은 클래스가 된다. */
function hashStr(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}
