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
 * 행정직원(staff) CRUD: 추가(ko/en, tasks는 TextList)→상세→편집→반영→삭제(편집 폼).
 * tasks는 `_new` 입력 후 '추가' 버튼으로 리스트에 넣는다.
 * 편집 폼엔 task별 '삭제'와 Form.Action '삭제'가 공존 → 마지막(.last())이 Form.Action.
 */
test.describe('행정직원 - 추가/편집/삭제 플로우', () => {
  test('staff가 행정직원을 추가→편집→삭제한다', async ({ page }) => {
    const koName = `자동화직원${Date.now()}`;
    const enName = `AutoStaff${Date.now()}`;
    const koNameEdited = `${koName}수정`;

    await setLocale(page, 'ko');
    await page.goto('/people/staff');
    await loginAsStaff(page);

    // === 추가 ===
    await page.getByRole('link', { name: '추가하기' }).click();
    await page.waitForURL('**/people/staff/create');

    await fillTextInput(page, 'ko.name', koName);
    await fillTextInput(page, 'ko.role', '행정');
    await fillTextInput(page, 'ko.office', '301동 316호');
    await fillTextInput(page, 'ko.phone', '02-880-0000');
    await fillTextInput(page, 'ko.email', 'auto@snu.ac.kr');
    await fillTextInput(page, 'ko.tasks_new', '학사 업무');
    await page.getByRole('button', { name: '추가', exact: true }).click();

    await switchEditorLanguage(page, 'en');
    await fillTextInput(page, 'en.name', enName);
    await fillTextInput(page, 'en.role', 'Admin');
    await fillTextInput(page, 'en.office', 'Bldg 301, Rm 316');
    await fillTextInput(page, 'en.phone', '02-880-0000');
    await fillTextInput(page, 'en.email', 'auto@snu.ac.kr');
    await fillTextInput(page, 'en.tasks_new', 'Academic affairs');
    await page.getByRole('button', { name: '추가', exact: true }).click();

    await submitForm(page);
    await expect(page.getByText('행정직원을 추가했습니다.')).toBeVisible();
    await page.waitForURL(/\/people\/staff\/\d+/);
    await expect(page.getByRole('heading', { name: koName })).toBeVisible();

    // === en round-trip === (/en 상세에 입력한 en 이름이 노출되는지)
    await expectEnDetailHeading(page, enName);

    // === 편집 ===
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/people\/staff\/\d+\/edit/);
    await fillTextInput(page, 'ko.name', koNameEdited);
    await submitForm(page);
    await expect(page.getByText('행정직원을 수정했습니다.')).toBeVisible();
    await page.waitForURL(/\/people\/staff\/\d+$/);
    await expect(page.getByRole('heading', { name: koNameEdited })).toBeVisible();

    // === 삭제 === (편집 폼의 Form.Action 삭제 → 확인). task별 삭제와 공존 → 트리거는 .last()
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/people\/staff\/\d+\/edit/);
    await deleteItem(page, '확인', page.getByRole('button', { name: '삭제' }).last());
    await expect(page.getByText('행정직원을 삭제했습니다.')).toBeVisible();
    await page.waitForURL('**/people/staff');
    await expect(page.getByText(koNameEdited)).toHaveCount(0);
  });
});
