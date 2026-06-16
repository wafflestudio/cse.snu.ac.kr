import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import {
  fillHTMLEditor,
  submitForm,
  switchEditorLanguage,
} from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/**
 * 편집-only 싱글톤 flow. greetings/history/contact는 공통 라우트 $type/edit를 쓰며,
 * 성공 토스트 없이 뷰어로 네비게이션한다(반영된 본문으로 검증).
 */
test.describe('학부장 인사말 - 편집 플로우', () => {
  test('staff가 인사말 본문을 수정하면 반영된다', async ({ page }) => {
    const koText = `수정된 인사말 ${Date.now()}`;
    const enText = `Edited greetings ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/about/greetings');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL('**/about/greetings/edit');

    await fillHTMLEditor(page, koText);
    await switchEditorLanguage(page, 'en');
    await fillHTMLEditor(page, enText);

    await submitForm(page);
    await page.waitForURL('**/about/greetings');
    await expect(page.getByText(koText)).toBeVisible();

    // === en round-trip === (/en 상세에 입력한 en 본문이 노출되는지)
    // greetings/history/contact/overview는 공통 $type/edit를 쓰므로 greetings로 대표 검증.
    await setLocale(page, 'en');
    await page.goto('/en/about/greetings');
    await expect(page.getByText(enText)).toBeVisible();
  });
});
