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
 * 리스트 CRUD (인라인 SelectionList): 추가→목록에 나타남→선택·편집→반영→삭제→사라짐.
 * 동아리 선택은 SelectionList 링크 클릭(?selected=id), 편집/삭제는 ClubDetails에서.
 */
test.describe('학생 동아리 - 추가/편집/삭제 플로우', () => {
  test('staff가 동아리를 추가→편집→삭제한다', async ({ page }) => {
    const koName = `자동화 동아리 ${Date.now()}`;
    const enName = `Auto Club ${Date.now()}`;
    const koNameEdited = `${koName} (수정)`;

    await setLocale(page, 'ko');
    await page.goto('/about/student-clubs');
    await loginAsStaff(page);

    // === 추가 ===
    await page.getByRole('link', { name: '동아리 추가' }).click();
    await page.waitForURL('**/about/student-clubs/create');
    await fillTextInput(page, 'ko.name', koName);
    await fillHTMLEditor(page, '<p>한글 소개</p>');
    await switchEditorLanguage(page, 'en');
    await fillTextInput(page, 'en.name', enName);
    await fillHTMLEditor(page, '<p>English intro</p>');
    await submitForm(page);
    await expect(page.getByText('동아리를 추가했습니다.')).toBeVisible();
    await page.waitForURL('**/about/student-clubs');
    await expect(page.getByRole('link', { name: koName })).toBeVisible();

    // === en round-trip === (/en 목록에 입력한 en 이름이 노출되는지; 상세는 인덱스 인라인)
    await setLocale(page, 'en');
    await page.goto('/en/about/student-clubs');
    await expect(page.getByText(enName).first()).toBeVisible();
    await setLocale(page, 'ko');
    await page.goto('/about/student-clubs');

    // === 편집 === (동아리 선택 → ClubDetails 편집)
    await page.getByRole('link', { name: koName }).click();
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL('**/about/student-clubs/edit**');
    await fillTextInput(page, 'ko.name', koNameEdited);
    await submitForm(page);
    await expect(page.getByText('동아리를 수정했습니다.')).toBeVisible();
    await page.waitForURL('**/about/student-clubs');
    await expect(page.getByRole('link', { name: koNameEdited })).toBeVisible();

    // === 삭제 === (선택 → ClubDetails 삭제, 확인 라벨 '삭제')
    await page.getByRole('link', { name: koNameEdited }).click();
    await deleteItem(page, '삭제');
    await expect(page.getByText('동아리를 삭제했습니다.')).toBeVisible();
    await expect(
      page.getByRole('link', { name: koNameEdited }),
    ).not.toBeVisible();
  });
});
