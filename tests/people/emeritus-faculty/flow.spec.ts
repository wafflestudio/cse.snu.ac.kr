import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import {
  deleteItem,
  fillTextInput,
  submitForm,
  switchEditorLanguage,
} from '../../helpers/forms';
import { expectEnDetailHeading, setLocale } from '../../helpers/locale';

/**
 * 명예교수(emeritus = professor INACTIVE) CRUD.
 * 추가는 FacultyEditor 공유(?status=INACTIVE) → 추가 후 emeritus 상세로. 편집/삭제는 emeritus 라우트.
 * 편집/삭제 토스트는 '역대 교수진을 ...'.
 */
test.describe('명예교수 - 추가/편집/삭제 플로우', () => {
  test('staff가 명예교수를 추가→편집→삭제한다', async ({ page }) => {
    const koName = `자동화명예${Date.now()}`;
    const enName = `AutoEmeritus${Date.now()}`;
    const koNameEdited = `${koName}수정`;

    await setLocale(page, 'ko');
    await page.goto('/people/emeritus-faculty');
    await loginAsStaff(page);

    // === 추가 === (FacultyEditor, status=INACTIVE)
    await page.getByRole('link', { name: '추가하기' }).click();
    await page.waitForURL(/\/people\/faculty\/create/);
    await fillTextInput(page, 'ko.name', koName);
    await fillTextInput(page, 'ko.academicRank', '명예교수');
    await switchEditorLanguage(page, 'en');
    await fillTextInput(page, 'en.name', enName);
    await fillTextInput(page, 'en.academicRank', 'Emeritus Professor');
    await submitForm(page);
    await expect(page.getByText('교수진을 추가했습니다.')).toBeVisible();
    await page.waitForURL(/\/people\/emeritus-faculty\/\d+/);
    await expect(page.getByRole('heading', { name: koName })).toBeVisible();

    // === en round-trip === (/en 상세에 입력한 en 이름이 노출되는지)
    await expectEnDetailHeading(page, enName);

    // === 편집 ===
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/people\/emeritus-faculty\/\d+\/edit/);
    await fillTextInput(page, 'ko.name', koNameEdited);
    await submitForm(page);
    await expect(page.getByText('역대 교수진을 수정했습니다.')).toBeVisible();
    await page.waitForURL(/\/people\/emeritus-faculty\/\d+$/);
    await expect(page.getByRole('heading', { name: koNameEdited })).toBeVisible();

    // === 삭제 === (편집 폼 Form.Action 삭제 → 확인). 트리거는 .last()
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/people\/emeritus-faculty\/\d+\/edit/);
    await deleteItem(page, '확인', page.getByRole('button', { name: '삭제' }).last());
    await expect(page.getByText('역대 교수진을 삭제했습니다.')).toBeVisible();
    await page.waitForURL('**/people/emeritus-faculty');
    await expect(page.getByText(koNameEdited)).toHaveCount(0);
  });
});
