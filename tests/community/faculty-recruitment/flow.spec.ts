import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import { fillHTMLEditor, fillTextInput, submitForm } from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/**
 * 신임교수초빙은 편집-only 싱글톤(PUT 업서트). 편집→반영 검증.
 * 편집 폼은 title을 defaultValues에 넣지 않아 빈 칸으로 시작 → 반드시 입력해야 한다.
 */
test.describe('신임교수초빙 - 편집 플로우', () => {
  test('staff가 본문을 수정하면 반영된다', async ({ page }) => {
    const title = `자동화 초빙 ${Date.now()}`;
    const desc = `초빙 본문 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/community/faculty-recruitment');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL('**/community/faculty-recruitment/edit');

    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, desc);
    await submitForm(page);

    await expect(
      page.getByText('신임교수초빙을 수정했습니다.'),
    ).toBeVisible();
    await page.waitForURL('**/community/faculty-recruitment');
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expect(page.getByText(desc)).toBeVisible();
  });
});
