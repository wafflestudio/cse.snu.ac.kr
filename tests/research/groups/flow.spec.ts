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
 * 연구 스트림 CRUD: 추가(ko/en)→목록에 나타남→선택·편집→반영→선택·삭제→사라짐.
 * 상세는 인덱스 인라인(SelectionList 선택). 편집/삭제는 선택된 항목 기준.
 * baseline(시스템)은 건드리지 않도록 고유 이름 사용.
 */
test.describe('연구 스트림 - 추가/편집/삭제 플로우', () => {
  test('staff가 연구 스트림을 추가→편집→삭제한다', async ({ page }) => {
    const koName = `자동화스트림${Date.now()}`;
    const enName = `AutoStream${Date.now()}`;
    const koNameEdited = `${koName}수정`;

    await setLocale(page, 'ko');
    await page.goto('/research/groups');
    await loginAsStaff(page);

    // === 추가 ===
    await page.getByRole('link', { name: '연구 스트림 추가' }).click();
    await page.waitForURL('**/research/groups/create');
    await fillTextInput(page, 'ko.name', koName);
    await fillHTMLEditor(page, '<p>한글 설명</p>');
    await switchEditorLanguage(page, 'en');
    await fillTextInput(page, 'en.name', enName);
    await fillHTMLEditor(page, '<p>English desc</p>');
    await submitForm(page);
    await expect(page.getByText('연구 스트림을 추가했습니다.')).toBeVisible();
    await page.waitForURL('**/research/groups');
    await expect(page.getByRole('link', { name: koName })).toBeVisible();

    // === en round-trip === (/en 목록에 입력한 en 이름이 노출되는지; 상세는 인덱스 인라인)
    // en 정렬상 새 스트림이 첫 항목이라 자동 선택될 수 있음(선택 시 목록 link가 아닌 제목으로 노출)
    // → link 역할 대신 텍스트로 검증.
    await setLocale(page, 'en');
    await page.goto('/en/research/groups');
    await expect(page.getByText(enName).first()).toBeVisible();
    await setLocale(page, 'ko');
    await page.goto('/research/groups');

    // === 편집 === (선택 → 편집)
    await page.getByRole('link', { name: koName }).click();
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/research\/groups\/.+\/edit/);
    await fillTextInput(page, 'ko.name', koNameEdited);
    await submitForm(page);
    await expect(page.getByText('연구 스트림을 수정했습니다.')).toBeVisible();
    await page.waitForURL('**/research/groups');
    await expect(page.getByRole('link', { name: koNameEdited })).toBeVisible();

    // === 삭제 === (선택 → 삭제 → 확인 '삭제')
    await page.getByRole('link', { name: koNameEdited }).click();
    await deleteItem(page, '삭제');
    await expect(page.getByText('연구 스트림을 삭제했습니다.')).toBeVisible();
    await expect(page.getByRole('link', { name: koNameEdited })).toHaveCount(0);
  });
});
