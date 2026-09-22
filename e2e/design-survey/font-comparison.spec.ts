import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, type Page, test } from '@playwright/test';
import { loginAsStaff } from '../tests/helpers/auth';
import { setLocale } from '../tests/helpers/locale';
import { normalizeDates } from '../tests/setup/db';
import { mockLoginCookie, postMultipart } from '../tests/setup/seed/client';

// 승인 전 비교: 프로덕션 빌드의 DOM에서 본문 컨테이너 font-family만 바꾼다.
// 적용 전 커밋 e71c63fc에서만 기존 비교를 재생성한다.
// 적용 확인: DESIGN_FONT_MODE=applied는 실제 CSS를 승인 견본과 대조한다.
const verifyApplied = process.env.DESIGN_FONT_MODE === 'applied';
const comparison = new URL(
  '../../docs/design-system/font-comparison/',
  import.meta.url,
);
const output = fileURLToPath(
  verifyApplied
    ? new URL('../../docs/design-system/font-implementation/', import.meta.url)
    : comparison,
);
const korean =
  '이 글은 디자인 조사용 로컬 표본이며 실제 공지가 아닙니다. 문단의 길이가 달라질 때 줄바꿈과 읽기 흐름을 확인합니다. Research projects require clear application instructions, accessible information, and consistent navigation across different screen sizes.';
const english =
  'Undergraduate and graduate students can find application instructions, programme schedules, and supporting documents here. Read the requirements carefully before submitting your application. Research projects connect students with laboratories across different fields.';
const description =
  '<h2>학사 일정과 연구 프로그램 / Research programmes</h2>' +
  `<p>${korean}</p><p>${english}</p>`.repeat(3) +
  '<h3>신청 단계</h3><ul><li>지원 자격 및 제출 서류 확인</li><li>신청서 작성 및 첨부 제출</li><li>접수 결과 확인</li></ul>' +
  '<p><strong>굵은 강조 / Important information</strong> · <em>기울임 / Emphasis</em></p>' +
  '<p><span style="font-size:18px">작성자가 지정한 18px 글자 / Authored size</span></p>' +
  '<table><thead><tr><th>프로그램</th><th>대상</th><th>접수 기간</th></tr></thead><tbody><tr><td>Undergraduate Research Programme</td><td>학부생 및 대학원생</td><td>2026-09-01 – 2026-09-30</td></tr></tbody></table>' +
  '<p><a href="https://example.com/research-programme/application-guidelines">Application guidelines and supporting documents</a></p>';

type SurveyWindow = Window & {
  fontSurveyCsp: { directive: string; blockedURI: string }[];
};

test('본문 서체 연결 전후 비교', async ({ page }) => {
  await mkdir(output, { recursive: true });
  await page.addInitScript(() => {
    const target = window as unknown as SurveyWindow;
    target.fontSurveyCsp = [];
    document.addEventListener('securitypolicyviolation', (event) => {
      target.fontSurveyCsp.push({
        directive: event.effectiveDirective,
        blockedURI: event.blockedURI,
      });
    });
  });
  const cookie = await mockLoginCookie();
  const created = await postMultipart<{ id: number }>(
    cookie,
    '/api/v2/notice',
    {
      title: '본문 서체 비교 — Academic Calendar and Research Programmes',
      titleForMain: null,
      description,
      isPrivate: false,
      isPinned: false,
      pinnedUntil: null,
      isImportant: false,
      importantUntil: null,
      tags: ['학부', '대학원'],
    },
  );
  const results: unknown[] = [];
  try {
    await normalizeDates();
    for (const width of [1280, 390, 768]) {
      await open(page, `/community/notice/${created.id}`, width, 'ko');
      results.push(await compare(page, `notice-ko-${width}`));
    }
    for (const width of [1280, 390]) {
      await open(page, '/about/greetings', width, 'en');
      results.push(await compare(page, `greetings-en-${width}`));
    }
    if (!verifyApplied) {
      await open(page, `/community/notice/${created.id}`, 1280, 'ko');
      await loginAsStaff(page);
      await open(page, `/community/notice/edit/${created.id}`, 1280, 'ko');
      await expect(page.locator('.sun-editor-editable')).toHaveAttribute(
        'contenteditable',
        'true',
      );
      results.push(await compare(page, 'editor-ko-1280'));
    }
    await writeFile(
      `${output}measurements.json`,
      `${JSON.stringify(
        {
          sourceBase: verifyApplied
            ? 'DS-006 font CSS working tree from e71c63fc'
            : 'd1baf83c',
          comparisonStart: '6249c8fb',
          date: '2026-09-22',
          environment:
            'Playwright 1.57.0 Chromium Linux / production build / DPR 1',
          method: verifyApplied
            ? 'Actual app CSS without browser style overrides. Compare viewer geometry with approved proposal; Editor behavior excluded by user scope. Cached API image; fresh production frontend build.'
            : 'Same DOM before/after; prepend registered Pretendard Variable only on .sun-editor-editable. CDP actual fonts, computed CSS, geometry and screenshots. No app CSS or saved HTML edits.',
          samples: results,
        },
        null,
        2,
      )}\n`,
    );
  } finally {
    const response = await fetch(
      `${process.env.E2E_API_URL ?? 'http://localhost:8080'}/api/v2/notice/${created.id}`,
      { method: 'DELETE', headers: { cookie } },
    );
    expect(response.ok).toBeTruthy();
  }
});

async function open(
  page: Page,
  path: string,
  width: number,
  locale: 'ko' | 'en',
) {
  await page.setViewportSize({ width, height: 844 });
  await setLocale(page, locale);
  const response = await page.goto(`/${locale}${path}`);
  expect(response?.status()).toBe(200);
  await expect(page.locator('.sun-editor-editable')).toBeVisible();
}

async function compare(page: Page, name: string) {
  const body = page.locator('.sun-editor-editable');
  const contents = await body.innerHTML();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const sample = async (variant: 'before' | 'after' | 'applied') => {
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const img of document.images) img.loading = 'eager';
      await Promise.all(
        Array.from(document.images, (img) =>
          img.decode().catch(() => undefined),
        ),
      );
    });
    const geometry = await body.evaluate((el) => {
      const read = (element: Element) => {
        const css = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(element);
        return {
          text: element.textContent?.trim().slice(0, 80),
          family: css.fontFamily,
          size: css.fontSize,
          weight: css.fontWeight,
          lineHeight: css.lineHeight,
          letterSpacing: css.letterSpacing,
          color: css.color,
          padding: css.padding,
          width: rect.width,
          height: rect.height,
          textLineTops: [
            ...new Set(
              Array.from(range.getClientRects(), (r) => r.top - rect.top),
            ),
          ],
        };
      };
      return {
        viewport: { width: innerWidth, height: innerHeight },
        document: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
        body: read(el),
        paragraphs: Array.from(el.querySelectorAll('p')).slice(0, 2).map(read),
        authoredSize: (() => {
          const span = Array.from(el.querySelectorAll('span')).find((item) =>
            item.textContent?.startsWith('작성자가 지정한 18px 글자'),
          );
          return span
            ? { ...read(span), inlineStyle: span.getAttribute('style') }
            : null;
        })(),
        uiFamily: getComputedStyle(document.body).fontFamily,
        cspViolations: Array.from(
          new Set(
            (window as unknown as SurveyWindow).fontSurveyCsp.map(
              (event) => `${event.directive}: ${event.blockedURI}`,
            ),
          ),
        ),
      };
    });
    const { root } = await cdp.send('DOM.getDocument');
    const fonts = [];
    for (const selector of [
      '.sun-editor-editable p',
      '.sun-editor-editable p:nth-of-type(2)',
      '.sun-editor-editable strong',
    ]) {
      const { nodeId } = await cdp.send('DOM.querySelector', {
        nodeId: root.nodeId,
        selector,
      });
      if (nodeId) {
        const result = await cdp.send('CSS.getPlatformFontsForNode', {
          nodeId,
        });
        fonts.push({ selector, fonts: result.fonts });
      }
    }
    // locator.screenshot의 자동 스크롤은 편집기의 sticky 툴바를 본문 위로 옮긴다.
    // 문서 맨 위에서 문서 좌표로 캡처해 툴바나 툴팁이 본문을 가리지 않게 한다.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.mouse.move(0, 0);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    const rect = await body.boundingBox();
    expect(rect).not.toBeNull();
    if (!rect) throw new Error('본문 영역이 없습니다.');
    await page.screenshot({
      path: `${output}${name}-${variant}-body.png`,
      fullPage: true,
      clip: rect,
      animations: 'disabled',
    });
    await page.screenshot({
      path: `${output}${name}-${variant}.png`,
      fullPage: true,
      animations: 'disabled',
      mask: [page.getByTestId('view-count')],
    });
    return { ...geometry, fonts };
  };
  if (verifyApplied) {
    const actual = await sample('applied');
    const reference = JSON.parse(
      await readFile(new URL('measurements.json', comparison), 'utf8'),
    );
    const approved = reference.samples.find(
      (item: { name: string }) => item.name === name,
    ).after;
    expect(
      actual.fonts[0].fonts.every(
        (font) =>
          font.isCustomFont && font.familyName === 'Pretendard Variable',
      ),
    ).toBe(true);
    for (const key of [
      'size',
      'weight',
      'lineHeight',
      'letterSpacing',
      'color',
      'padding',
      'width',
    ] as const) {
      expect(actual.body[key]).toBe(approved.body[key]);
    }
    expect(actual.body.height).toBe(approved.body.height);
    const expectedImage = await readFile(
      new URL(`${name}-after-body.png`, comparison),
    );
    const actualImage = await readFile(`${output}${name}-applied-body.png`);
    expect(
      actualImage.equals(expectedImage),
      '승인한 본문 이미지와 실제 CSS 적용 결과',
    ).toBe(true);
    await cdp.detach();
    return { name, path: new URL(page.url()).pathname, actual };
  }
  const before = await sample('before');
  await body.evaluate((el) => {
    (el as HTMLElement).style.fontFamily =
      `"Pretendard Variable", ${getComputedStyle(el).fontFamily}`;
  });
  const after = await sample('after');
  expect(await body.innerHTML()).toBe(contents);
  for (const key of [
    'size',
    'weight',
    'lineHeight',
    'letterSpacing',
    'color',
    'padding',
  ] as const) {
    expect(after.body[key]).toBe(before.body[key]);
  }
  expect(after.uiFamily).toBe(before.uiFamily);
  // 짧은 인사말처럼 내용에 맞춰 줄어드는 영역은 서체의 글자 폭에 따라 실측 폭도 바뀐다.
  // 폭을 강제로 고정하지 않고 원래 레이아웃에서의 결과를 기록한다.
  expect(
    after.fonts[0].fonts.some(
      (font) => font.isCustomFont && font.familyName.includes('Pretendard'),
    ),
  ).toBe(true);
  if (before.authoredSize) {
    expect(after.authoredSize?.size).toBe(before.authoredSize.size);
    expect(after.authoredSize?.inlineStyle).toBe(
      before.authoredSize.inlineStyle,
    );
  }
  await cdp.detach();
  return { name, path: new URL(page.url()).pathname, before, after };
}
