import Autolinker from 'autolinker';
import * as cheerio from 'cheerio';
import type { ProcessedHtml } from './csp';

// cheerio(+htmlparser2·css-select·entities)와 autolinker는 무겁다(클라 번들 ~325KB gzip).
// 이 모듈은 순수 변환 로직만 담고, 라우트 loader는 cspServerFn.ts의 serverFn으로만 호출해
// 클라 번들에 cheerio가 들어가지 않게 한다. 스토리(SB 브라우저)는 serverFn을 못 쓰므로
// 이 순수 함수를 직접 import한다(SB는 앱 번들과 무관).

/** 결정론적 문자열 해시(FNV-1a 32bit → base36). 충돌 회피용 식별자 생성. */
const hashStr = (input: string): string => {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
};

export const processHtmlForCsp = (html: string): ProcessedHtml => {
  // 400.5 같은 숫자가 링크로 인식되는걸 방지 (tldMatches: false)
  const linkedHTML = Autolinker.link(html, {
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

    // CSS 속성들을 개별적으로 파싱
    const properties = styleAttr
      .split(';')
      .map((prop) => prop.trim())
      .filter((prop) => prop.length > 0)
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
  const trimmedHTML = $('html').length > 0 ? $('body').html() || '' : $.html();

  // styleKey는 모든 고유 속성을 정렬해서 해싱
  const allProperties = Array.from(propertyToClassMap.keys()).sort().join('|');
  const styleKey = hashStr(allProperties);

  return { html: trimmedHTML, cssRules: cssRules.join('\n'), styleKey };
};
