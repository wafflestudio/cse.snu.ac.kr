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
 * 연구 센터 CRUD: 추가(ko/en)→목록에 나타남→선택·편집→반영→선택·삭제→사라짐.
 * baseline(인공지능 연구센터)은 건드리지 않도록 고유 이름 사용.
 */
test.describe('연구 센터 - 추가/편집/삭제 플로우', () => {
  test('staff가 연구 센터를 추가→편집→삭제한다', async ({ page }) => {
    const koName = `자동화센터${Date.now()}`;
    const enName = `AutoCenter${Date.now()}`;
    const koNameEdited = `${koName}수정`;

    await setLocale(page, 'ko');
    await page.goto('/research/centers');
    await loginAsStaff(page);

    // === 추가 ===
    await page.getByRole('link', { name: '연구 센터 추가' }).click();
    await page.waitForURL('**/research/centers/create');
    await fillTextInput(page, 'ko.name', koName);
    await fillHTMLEditor(page, '<p>한글 설명</p>');
    await switchEditorLanguage(page, 'en');
    await fillTextInput(page, 'en.name', enName);
    await fillHTMLEditor(page, '<p>English desc</p>');
    await submitForm(page);
    await expect(page.getByText('연구 센터를 추가했습니다.')).toBeVisible();
    await page.waitForURL('**/research/centers');
    await expect(page.getByRole('link', { name: koName })).toBeVisible();

    // === en round-trip === (/en 목록에 입력한 en 이름이 노출되는지; 상세는 인덱스 인라인)
    await setLocale(page, 'en');
    await page.goto('/en/research/centers');
    await expect(page.getByRole('link', { name: enName })).toBeVisible();
    await setLocale(page, 'ko');
    await page.goto('/research/centers');

    // === 편집 === (선택 → 편집)
    await page.getByRole('link', { name: koName }).click();
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/research\/centers\/\d+\/edit/);
    await fillTextInput(page, 'ko.name', koNameEdited);
    await submitForm(page);
    await expect(page.getByText('연구 센터를 수정했습니다.')).toBeVisible();
    await page.waitForURL('**/research/centers');
    await expect(page.getByRole('link', { name: koNameEdited })).toBeVisible();

    // === 삭제 === (선택 → 삭제 → 확인 '삭제')
    await page.getByRole('link', { name: koNameEdited }).click();
    await deleteItem(page, '삭제');
    await expect(page.getByText('연구 센터를 삭제했습니다.')).toBeVisible();
    await expect(page.getByRole('link', { name: koNameEdited })).toHaveCount(0);
  });
});
