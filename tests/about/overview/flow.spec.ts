import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import {
  fillHTMLEditor,
  submitForm,
  switchEditorLanguage,
} from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/**
 * 편집-only 싱글톤 flow (reference): staff가 본문을 수정하면 뷰어에 반영된다.
 * about content는 PUT으로 양 언어 upsert(기존 행 전제, SQL로 시드됨).
 */
test.describe('학부 소개 - 편집 플로우', () => {
  test('staff가 학부 소개 본문을 수정하면 반영된다', async ({ page }) => {
    const koText = `수정된 학부 소개 ${Date.now()}`;
    const enText = `Edited overview ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/about/overview');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL('**/about/overview/edit');

    await fillHTMLEditor(page, koText);
    await switchEditorLanguage(page, 'en');
    await fillHTMLEditor(page, enText);

    await submitForm(page);
    await expect(page.getByText('학부 소개를 수정했습니다.')).toBeVisible();
    await page.waitForURL('**/about/overview');

    // 뷰어에 수정 내용 반영
    await expect(page.getByText(koText)).toBeVisible();
  });
});
