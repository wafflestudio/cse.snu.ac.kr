import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../helpers/auth';
import { fillHTMLEditor, submitForm } from '../helpers/forms';
import { setLocale } from '../helpers/locale';

/** 학부 메일링리스트 편집-only 싱글톤. 편집→반영 검증(성공 토스트 없음, 네비게이션으로 확인). */
test.describe('학부 메일링리스트 - 편집 플로우', () => {
  test('staff가 본문을 수정하면 반영된다', async ({ page }) => {
    const text = `수정된 메일링리스트 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/.internal');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL('**/.internal/edit');

    await fillHTMLEditor(page, text);
    await submitForm(page);

    await page.waitForURL((url) => url.pathname.endsWith('/.internal'));
    await expect(page.getByText(text)).toBeVisible();
  });
});
