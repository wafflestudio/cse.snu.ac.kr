import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import {
  fillHTMLEditor,
  submitForm,
  switchEditorLanguage,
} from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

test.describe('연락처 - 편집 플로우', () => {
  test('staff가 연락처 본문을 수정하면 반영된다', async ({ page }) => {
    const koText = `수정된 연락처 ${Date.now()}`;
    const enText = `Edited contact ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/about/contact');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL('**/about/contact/edit');

    await fillHTMLEditor(page, koText);
    await switchEditorLanguage(page, 'en');
    await fillHTMLEditor(page, enText);

    await submitForm(page);
    await page.waitForURL('**/about/contact');
    await expect(page.getByText(koText)).toBeVisible();
  });
});
