import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import {
  deleteItem,
  fillHTMLEditor,
  fillTextInput,
  submitForm,
  switchEditorLanguage,
} from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/**
 * 행(article) 단위 CRUD: 추가→행 나타남→행의 편집→반영→행의 삭제→사라짐.
 * 여러 행이 각자 편집/삭제 버튼을 가지므로, 고유 이름으로 행을 스코프해 조작한다.
 */
test.describe('시설 안내 - 추가/편집/삭제 플로우', () => {
  test('staff가 시설을 추가→편집→삭제한다', async ({ page }) => {
    const koName = `자동화 시설 ${Date.now()}`;
    const enName = `Auto Facility ${Date.now()}`;
    const koNameEdited = `${koName} (수정)`;

    await setLocale(page, 'ko');
    await page.goto('/about/facilities');
    await loginAsStaff(page);

    // === 추가 ===
    await page.getByRole('link', { name: '시설 추가' }).click();
    await page.waitForURL('**/about/facilities/create');
    await fillTextInput(page, 'ko.name', koName);
    await fillHTMLEditor(page, '<p>한글 소개</p>');
    await switchEditorLanguage(page, 'en');
    await fillTextInput(page, 'en.name', enName);
    await fillHTMLEditor(page, '<p>English intro</p>');
    await submitForm(page);
    await expect(page.getByText('시설을 추가했습니다.')).toBeVisible();
    await page.waitForURL('**/about/facilities');

    const row = page.locator('article').filter({ hasText: koName });
    await expect(row).toBeVisible();

    // === en round-trip === (/en 목록에 입력한 en 이름이 노출되는지)
    await setLocale(page, 'en');
    await page.goto('/en/about/facilities');
    await expect(page.getByText(enName).first()).toBeVisible();
    await setLocale(page, 'ko');
    await page.goto('/about/facilities');

    // === 편집 === (해당 행의 편집 링크)
    await row.getByRole('link', { name: '편집' }).click();
    await page.waitForURL('**/about/facilities/edit**');
    await fillTextInput(page, 'ko.name', koNameEdited);
    await submitForm(page);
    await expect(page.getByText('시설을 수정했습니다.')).toBeVisible();
    await page.waitForURL('**/about/facilities');

    const editedRow = page.locator('article').filter({ hasText: koNameEdited });
    await expect(editedRow).toBeVisible();

    // === 삭제 === (행 스코프 삭제 트리거 → 다이얼로그 확인 '삭제')
    await deleteItem(
      page,
      '삭제',
      editedRow.getByRole('button', { name: '삭제' }),
    );
    await expect(page.getByText('시설을 삭제했습니다.')).toBeVisible();
    await expect(
      page.locator('article').filter({ hasText: koNameEdited }),
    ).toHaveCount(0);
  });
});
