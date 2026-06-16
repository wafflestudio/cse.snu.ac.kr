import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import {
  fillHTMLEditor,
  submitForm,
  switchEditorLanguage,
} from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/**
 * directions는 :id 편집-only(생성/삭제 API 없음).
 * 기본 선택 항목(대중교통)을 편집한다 — 저장 후 navigate가 ?selected 없이 돌아가
 * 다시 기본 선택이 되므로 편집 결과가 그대로 보인다.
 */
test.describe('찾아오는 길 - 편집 플로우', () => {
  test('staff가 경로 안내를 수정하면 반영된다', async ({ page }) => {
    const koText = `수정된 길안내 ${Date.now()}`;
    const enText = `Edited directions ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/about/directions');
    await loginAsStaff(page);

    // 기본 선택 항목의 편집(편집 링크는 선택된 항목에 대해 하나만 노출)
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/about\/directions\/\d+\/edit$/);
    // en round-trip 검증용으로 편집 중인 항목 id 확보(en 기본 선택이 ko와 다를 수 있어 ?selected로 고정)
    const id = page.url().match(/\/directions\/(\d+)\/edit/)?.[1] ?? '';

    await fillHTMLEditor(page, koText);
    await switchEditorLanguage(page, 'en');
    await fillHTMLEditor(page, enText);

    await submitForm(page);
    await page.waitForURL('**/about/directions');
    await expect(page.getByText(koText)).toBeVisible();

    // === en round-trip === (/en 같은 항목 상세에 입력한 en 본문 노출)
    await setLocale(page, 'en');
    await page.goto(`/en/about/directions?selected=${id}`);
    await expect(page.getByText(enText)).toBeVisible();
  });
});
