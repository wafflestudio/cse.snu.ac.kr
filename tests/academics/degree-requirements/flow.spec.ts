import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import { fillHTMLEditor, submitForm } from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/** 졸업 규정 편집-only 싱글톤. 편집→반영 검증. */
test.describe('졸업 규정 - 편집 플로우', () => {
  test('staff가 졸업 규정을 수정하면 반영된다', async ({ page }) => {
    const text = `수정된 졸업 규정 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/academics/undergraduate/degree-requirements');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL('**/academics/undergraduate/degree-requirements/edit');

    await fillHTMLEditor(page, text);
    await submitForm(page);

    await expect(page.getByText('학부 졸업규정을 수정했습니다.')).toBeVisible();
    await page.waitForURL(
      '**/academics/undergraduate/degree-requirements',
    );
    await expect(page.getByText(text)).toBeVisible();
  });
});
