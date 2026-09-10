import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import { fillHTMLEditor, submitForm } from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/**
 * 학부 안내(guide) 편집-only 싱글톤. 편집→반영 검증.
 * 단일 HTML 에디터(언어 토글 없음, 백엔드 기본 ko 업데이트).
 */
test.describe('학사 안내(guide) - 편집 플로우', () => {
  test('staff가 학부 안내를 수정하면 반영된다', async ({ page }) => {
    const text = `수정된 학부 안내 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/academics/undergraduate/guide');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL('**/academics/undergraduate/guide/edit');

    await fillHTMLEditor(page, text);
    await submitForm(page);

    await expect(page.getByText('수정에 성공했습니다.')).toBeVisible();
    await page.waitForURL('**/academics/undergraduate/guide');
    await expect(page.getByText(text)).toBeVisible();
  });
});
