import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import {
  deleteItem,
  fillHTMLEditor,
  fillTextInput,
  submitForm,
  switchEditorLanguage,
} from '../../helpers/forms';
import { expectEnDetailHeading, setLocale } from '../../helpers/locale';

/**
 * 장학금 CRUD: 추가(ko/en)→목록→상세→편집→상세 반영→삭제→목록에서 사라짐.
 * baseline(성적우수 장학금)은 건드리지 않도록 고유 이름.
 */
test.describe('장학 제도 - 추가/편집/삭제 플로우', () => {
  test('staff가 장학금을 추가→편집→삭제한다', async ({ page }) => {
    const koName = `자동화장학${Date.now()}`;
    const enName = `AutoSch${Date.now()}`;
    const koNameEdited = `${koName}수정`;

    await setLocale(page, 'ko');
    await page.goto('/academics/undergraduate/scholarship');
    await loginAsStaff(page);

    // === 추가 ===
    await page.getByRole('link', { name: '장학금 추가' }).click();
    await page.waitForURL('**/academics/undergraduate/scholarship/create');
    await fillTextInput(page, 'koName', koName);
    await fillHTMLEditor(page, '<p>한글 설명</p>');
    await switchEditorLanguage(page, 'en');
    await fillTextInput(page, 'enName', enName);
    await fillHTMLEditor(page, '<p>English desc</p>');
    await submitForm(page);
    await expect(page.getByText('장학금을 추가했습니다.')).toBeVisible();
    await page.waitForURL('**/academics/undergraduate/scholarship');
    await expect(page.getByRole('link', { name: koName })).toBeVisible();

    // === 상세 → 편집 ===
    await page.getByRole('link', { name: koName }).click();
    await page.waitForURL(/\/academics\/undergraduate\/scholarship\/\d+/);
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/scholarship\/\d+\/edit/);
    await fillTextInput(page, 'koName', koNameEdited);
    await submitForm(page);
    await expect(page.getByText('장학금을 수정했습니다.')).toBeVisible();
    await page.waitForURL(/\/academics\/undergraduate\/scholarship\/\d+/);
    await expect(
      page.getByRole('heading', { name: koNameEdited }),
    ).toBeVisible();

    // === en round-trip === (/en 상세에 입력한 en 이름이 노출되는지)
    await expectEnDetailHeading(page, enName);

    // === 삭제 === (상세 삭제 → 확인 '삭제')
    await deleteItem(page, '삭제');
    await expect(page.getByText('장학금을 삭제했습니다.')).toBeVisible();
    await page.waitForURL('**/academics/undergraduate/scholarship');
    await expect(
      page.getByRole('link', { name: koNameEdited }),
    ).toHaveCount(0);
  });
});
