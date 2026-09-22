import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, type Locator, test } from '@playwright/test';
import { loginAsStaff } from '../tests/helpers/auth';
import { fillHTMLEditor } from '../tests/helpers/forms';
import { setLocale } from '../tests/helpers/locale';

const output = fileURLToPath(
  new URL('../../docs/design-system/measurements/', import.meta.url),
);

test('역할별 렌더 값·서체·초점 표본', async ({ page }) => {
  await mkdir(output, { recursive: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await setLocale(page, 'ko');
  const results: unknown[] = [];
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  let serial = 0;
  const measure = async (role: string, locator: Locator) => {
    await expect(locator).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const id = `survey-${serial++}`;
    const data = await locator.evaluate((el, id) => {
      el.setAttribute('data-survey-measure', id);
      const css = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const placeholder = getComputedStyle(el, '::placeholder');
      return {
        tag: el.tagName,
        text: el.textContent?.trim().slice(0, 100),
        fontFamily: css.fontFamily,
        fontSize: css.fontSize,
        fontWeight: css.fontWeight,
        lineHeight: css.lineHeight,
        letterSpacing: css.letterSpacing,
        color: css.color,
        background: css.backgroundColor,
        border: [css.borderTopWidth, css.borderTopStyle, css.borderTopColor],
        radius: css.borderRadius,
        padding: css.padding,
        gap: css.gap,
        width: rect.width,
        height: rect.height,
        outline: [css.outlineWidth, css.outlineStyle, css.outlineColor],
        boxShadow: css.boxShadow,
        opacity: css.opacity,
        focused: document.activeElement === el,
        focusVisible: el.matches(':focus-visible'),
        hovered: el.matches(':hover'),
        placeholderColor: el.matches('input,textarea')
          ? placeholder.color
          : null,
      };
    }, id);
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: `[data-survey-measure="${id}"]`,
    });
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    results.push({
      role,
      path: new URL(page.url()).pathname,
      viewport: page.viewportSize(),
      ...data,
      renderedFonts: fonts,
    });
  };
  const open = async (path: string) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('header')).toBeVisible();
  };
  const hover = async (locator: Locator) => {
    // 에디터 툴바의 스크롤 반응으로 위치가 바뀔 수 있으므로 실제 hover도 확인한다.
    await expect(async () => {
      await locator.hover();
      await locator.evaluate(async (el) => {
        await new Promise(requestAnimationFrame);
        await Promise.all(
          el.getAnimations().map((animation) => animation.finished),
        );
      });
      expect(await locator.evaluate((el) => el.matches(':hover'))).toBe(true);
    }).toPass({ timeout: 10_000 });
  };

  await open('/community/notice');
  await measure(
    'mobile-menu-closed',
    page.getByRole('button', { name: '메뉴 열기' }),
  );
  await page.getByRole('button', { name: '메뉴 열기' }).click();
  await measure(
    'mobile-menu-open',
    page.getByRole('button', { name: '메뉴 닫기' }),
  );
  await page.getByRole('button', { name: '메뉴 닫기' }).click();
  await measure(
    'search-action',
    page.getByRole('button', { name: '검색', exact: true }),
  );
  await measure(
    'filter-checkbox-label',
    page
      .locator('label')
      .filter({ hasText: /^학부$/ })
      .first(),
  );
  await page.getByRole('link', { name: '학사 일정 안내', exact: true }).click();
  await page.waitForURL(/\/community\/notice\/\d+/);
  await measure(
    'page-title-mobile',
    page
      .getByRole('heading', { name: '공지사항', exact: true })
      .locator('span')
      .last(),
  );
  await measure(
    'post-title',
    page.getByRole('heading', { name: '학사 일정 안내', exact: true }),
  );
  await measure('viewer-body', page.locator('.sun-editor-editable p').first());
  const tag = page
    .getByRole('link', { name: '학부', exact: true })
    .filter({ visible: true })
    .first();
  await measure('tag-default', tag);
  await hover(tag);
  await measure('tag-hover', tag);
  await page.setViewportSize({ width: 1280, height: 844 });
  await measure(
    'page-title-desktop',
    page
      .getByRole('heading', { name: '공지사항', exact: true })
      .locator('span')
      .last(),
  );

  await open('/about');
  await measure(
    'category-title-desktop',
    page.getByText('소개', { exact: true }).filter({ visible: true }).last(),
  );
  await open('/');
  await measure(
    'slogan',
    page.locator('p').filter({ hasText: '창의와 지식을 융합하여' }).first(),
  );

  await open('/community/notice');
  await loginAsStaff(page);
  await open('/community/notice/create');
  const input = page.locator('input[name="title"]');
  await measure('form-text-default', input);
  await input.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(input).toBeFocused();
  await measure('form-text-keyboard-focus', input);
  await measure(
    'form-label',
    page.locator('legend').filter({ hasText: '메인-중요 안내용 제목' }),
  );
  await fillHTMLEditor(page, '서체 확인용 한글과 English text');
  await measure('editor-body', page.locator('.sun-editor-editable').first());
  await measure(
    'form-commit',
    page.getByRole('button', { name: '게시하기', exact: true }),
  );
  await hover(page.getByRole('button', { name: '게시하기', exact: true }));
  await measure(
    'form-commit-hover',
    page.getByRole('button', { name: '게시하기', exact: true }),
  );
  await measure(
    'form-cancel',
    page.getByRole('button', { name: '취소', exact: true }),
  );

  await open('/academics/undergraduate/courses');
  await measure(
    'primary-action',
    page.getByRole('button', { name: '새 교과목', exact: true }),
  );
  await page
    .getByRole('button', { name: '컴퓨터의 개념 및 실습', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await measure(
    'dialog-close',
    page.getByRole('dialog').locator('button.absolute.right-4.top-4'),
  );
  await writeFile(
    `${output}runtime.json`,
    `${JSON.stringify(
      {
        sourceBase: 'd1baf83c',
        surveyStart: '4534063a',
        date: '2026-09-22',
        environment:
          'Playwright 1.57.0 Chromium Linux / production build / Asia/Seoul / DPR 1',
        method:
          'Computed CSS, bounding boxes and Chrome DevTools CSS.getPlatformFontsForNode. Text input focus reached with Tab then Shift+Tab. No CSS overrides.',
        samples: results,
      },
      null,
      2,
    )}\n`,
  );
});
