import crypto from 'node:crypto';
import Autolinker from 'autolinker';
import * as cheerio from 'cheerio';
import { createContext } from 'react-router';

export const nonceContext = createContext<string>();

export const createNonce = () => crypto.randomBytes(16).toString('hex');

export const getCSPHeaders = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://t1.daumcdn.net http://t1.daumcdn.net https://dapi.kakao.com`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    "img-src 'self' https://cse.snu.ac.kr https://mts.daumcdn.net http://mts.daumcdn.net https://t1.daumcdn.net http://t1.daumcdn.net",
    "font-src 'self' https://fonts.gstatic.com",
  ]
    .join('; ')
    .trim();

export interface ProcessedHtml {
  html: string;
  cssRules: string;
  styleKey: string;
}

export const processHtmlForCsp = (html: string): ProcessedHtml => {
  // 400.XXX같은 값들이 링크 처리되는걸 막기 위해 tldMatches false처리
  const linkedHTML = Autolinker.link(html, {
    urls: { tldMatches: false },
  }).trim();

  const $ = cheerio.load(linkedHTML);

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

      // 새로운 클래스명 생성 (crypto 해시 + 접두사)
      const hash = crypto
        .createHash('md5')
        .update(property)
        .digest('base64url')
        .slice(0, 8);
      const className = `uwu-${hash}`;
      propertyToClassMap.set(property, className);
      cssRules.push(`.${className} { ${property} }`);

      return className;
    });

    $el.attr('class', classNames.join(' '));
    $el.removeAttr('style');
  });

  // <html> 태그가 있으면 body 내용만, 아니면 전체 HTML
  const trimmedHTML = $('html').length > 0 ? $('body').html() || '' : $.html();

  // styleKey는 모든 고유 속성을 정렬해서 해싱
  const allProperties = Array.from(propertyToClassMap.keys()).sort().join('|');
  const styleKey = crypto
    .createHash('md5')
    .update(allProperties)
    .digest('base64url')
    .slice(0, 12);

  return { html: trimmedHTML, cssRules: cssRules.join('\n'), styleKey };
};
