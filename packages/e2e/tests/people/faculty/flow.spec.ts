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
 * 교수진(faculty) CRUD: 추가(ko/en, 필수=이름·직함만)→상세→편집→반영→삭제(편집 폼).
 * 구분(status)은 기본 ACTIVE. 날짜/소속/연구실/학력 등은 선택이라 미입력.
 * 신규 교수는 학력/연구분야/경력이 비어 list-item '삭제'가 없으므로 Form.Action 삭제만 존재.
 */
test.describe('교수진 - 추가/편집/삭제 플로우', () => {
  test('staff가 교수진을 추가→편집→삭제한다', async ({ page }) => {
    const koName = `자동화교수${Date.now()}`;
    const enName = `AutoProf${Date.now()}`;
    const koNameEdited = `${koName}수정`;

    await setLocale(page, 'ko');
    await page.goto('/people/faculty');
    await loginAsStaff(page);

    // === 추가 ===
    await page.getByRole('link', { name: '추가하기' }).click();
    await page.waitForURL('**/people/faculty/create');
    await fillTextInput(page, 'ko.name', koName);
    await fillTextInput(page, 'ko.academicRank', '교수');
    await switchEditorLanguage(page, 'en');
    await fillTextInput(page, 'en.name', enName);
    await fillTextInput(page, 'en.academicRank', 'Professor');
    await submitForm(page);
    await expect(page.getByText('교수진을 추가했습니다.')).toBeVisible();
    await page.waitForURL(/\/people\/faculty\/\d+/);
    await expect(page.getByRole('heading', { name: koName })).toBeVisible();

    // === en round-trip === (/en 상세에 입력한 en 이름이 노출되는지)
    await expectEnDetailHeading(page, enName);

    // === 편집 ===
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/people\/faculty\/\d+\/edit/);
    await fillTextInput(page, 'ko.name', koNameEdited);
    await submitForm(page);
    await expect(page.getByText('교수진을 수정했습니다.')).toBeVisible();
    await page.waitForURL(/\/people\/faculty\/\d+$/);
    await expect(
      page.getByRole('heading', { name: koNameEdited }),
    ).toBeVisible();

    // === 삭제 === (편집 폼 Form.Action 삭제 → 확인). 학력별 삭제와 겹칠 수 있어 트리거는 .last()
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/people\/faculty\/\d+\/edit/);
    await deleteItem(
      page,
      '확인',
      page.getByRole('button', { name: '삭제' }).last(),
    );
    await expect(page.getByText('교수진을 삭제했습니다.')).toBeVisible();
    await page.waitForURL('**/people/faculty');
    await expect(page.getByText(koNameEdited)).toHaveCount(0);
  });
});
