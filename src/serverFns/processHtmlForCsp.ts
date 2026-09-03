import { createServerFn } from '@tanstack/react-start';
import type { ProcessedHtml } from '@/utils/csp';

// 백엔드 HTML(suneditor 산출물)을 strict CSP에서 렌더 가능한 형태로 변환.
// - 링크 autolink + rel 보안 속성
// - 인라인 style → 해시 클래스 + cssRules(호출측이 nonce <style>로 주입)
//
// cheerio·autolinker(~325KB gz)는 handler 안 dynamic import로만 참조한다 — 클라 빌드는
// handler 본문을 스트립하므로 클라 모듈 그래프에 아예 안 올라간다. ⚠️ 로직을 handler 밖
// top-level 함수로 빼면 이 보장이 깨진다(스트립 대상은 handler 본문뿐).
// 호출은 `await processHtmlForCsp({ data: html })` — SSR은 in-process, SPA 네비 때만 RPC.
export const processHtmlForCsp = createServerFn({ method: 'POST' })
  .validator((html: string) => html)
  .handler(async ({ data }): Promise<ProcessedHtml> => {
    const [{ default: Autolinker }, cheerio] = await Promise.all([
      import('autolinker'),
      import('cheerio'),
    ]);

    /** 결정론적 문자열 해시(FNV-1a 32bit → base36). 충돌 회피용 식별자 생성. */
    const hashStr = (input: string): string => {
      let h = 0x811c9dc5;
      for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
      }
      return (h >>> 0).toString(36);
    };

    // 400.5 같은 숫자가 링크로 인식되는걸 방지 (tldMatches: false)
    const linkedHTML = Autolinker.link(data, {
      urls: { tldMatches: false },
    }).trim();

    const $ = cheerio.load(linkedHTML);

    // 모든 링크에 보안 속성 추가
    $('a').each((_i, el) => {
      const $a = $(el);
      const existingRel = $a.attr('rel');
      const newRel = existingRel
        ? `${existingRel} noopener noreferrer`
        : 'noopener noreferrer';
      $a.attr('rel', newRel);
    });

    // CSS 속성 -> 클래스명 매핑 (캐싱용)
    const propertyToClassMap = new Map<string, string>();
    const cssRules: string[] = [];

    $('[style]').each((_i, el) => {
      const $el = $(el);
      const styleAttr = $el.attr('style');
      if (styleAttr === undefined) return;

      // CSS 속성들을 개별적으로 파싱.
      // `{`·`}`·`@`가 든 선언은 버린다 — 아래에서 `.class { ... }` 안에 그대로 삽입하므로
      // 규칙 밖으로 탈출해 임의 CSS(예: body{display:none})를 nonce 달고 주입할 수 있다.
      const properties = styleAttr
        .split(';')
        .map((prop) => prop.trim())
        .filter((prop) => prop.length > 0 && !/[{}@]/.test(prop))
        .map((prop) => `${prop};`);
      const classNames = properties.map((property) => {
        const cached = propertyToClassMap.get(property);
        if (cached) return cached;

        // 새로운 클래스명 생성 (해시 + 접두사)
        const hash = hashStr(property);
        const className = `uwu-${hash}`;
        propertyToClassMap.set(property, className);
        // !important를 붙여서 기존 스타일보다 높은 우선순위 보장
        // property는 이미 세미콜론으로 끝나므로, 세미콜론 전에 !important 삽입
        const propertyWithImportant = property.replace(/;$/, ' !important');
        cssRules.push(`.${className} { ${propertyWithImportant} }`);

        return className;
      });

      $el.attr('class', classNames.join(' '));
      $el.removeAttr('style');
    });

    // <html> 태그가 있으면 body 내용만, 아니면 전체 HTML
    const trimmedHTML =
      $('html').length > 0 ? $('body').html() || '' : $.html();

    // styleKey는 모든 고유 속성을 정렬해서 해싱
    const allProperties = Array.from(propertyToClassMap.keys())
      .sort()
      .join('|');
    const styleKey = hashStr(allProperties);

    return { html: trimmedHTML, cssRules: cssRules.join('\n'), styleKey };
  });
