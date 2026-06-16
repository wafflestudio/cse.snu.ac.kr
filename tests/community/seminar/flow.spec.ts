import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import {
  deleteItem,
  fillHTMLEditor,
  fillTextInput,
  submitForm,
} from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/**
 * 세미나 CRUD: 작성→목록 복귀→상세→편집→상세 반영→삭제→목록에서 사라짐.
 * 세미나는 작성 성공 시 목록으로 돌아간다(상세 아님). 시작 일시는 기본값(오늘) 사용.
 * SeminarDto가 description/introduction non-null이라 두 에디터 모두 채운다.
 * 상세 삭제 토스트는 '게시글을 삭제했습니다.'($id.tsx).
 */
test.describe('세미나 - 작성/편집/삭제 플로우', () => {
  test('staff가 세미나를 작성→편집→삭제한다', async ({ page }) => {
    const title = `자동화 세미나 ${Date.now()}`;
    const titleEdited = `${title} (수정)`;

    await setLocale(page, 'ko');
    await page.goto('/community/seminar');
    await loginAsStaff(page);

    // === 작성 ===
    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/seminar/create');
    await fillTextInput(page, 'title', title);
    await fillTextInput(page, 'location', '301동 세미나실');
    await fillTextInput(page, 'name', '김연사');
    await fillTextInput(page, 'affiliation', '서울대학교');
    // 요약(0)·연사 소개(1) 두 에디터 모두 채움
    await fillHTMLEditor(page, '<p>요약 본문</p>', 0);
    await fillHTMLEditor(page, '<p>연사 소개 본문</p>', 1);
    await submitForm(page); // 기본 '저장하기'
    await expect(page.getByText('세미나를 게시했습니다.')).toBeVisible();
    await page.waitForURL('**/community/seminar');

    // 목록에서 새 세미나 → 상세
    await page.getByRole('heading', { name: title }).click();
    await page.waitForURL(/\/community\/seminar\/\d+/);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();

    // === 편집 === (상세 PostFooter 편집)
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/community\/seminar\/edit\/\d+/);
    await fillTextInput(page, 'title', titleEdited);
    await submitForm(page);
    await expect(page.getByText('세미나를 수정했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/seminar\/\d+/);
    await expect(page.getByRole('heading', { name: titleEdited })).toBeVisible();

    // === 삭제 === (상세 PostFooter 삭제 → 확인 '삭제')
    await deleteItem(page, '삭제');
    await expect(page.getByText('게시글을 삭제했습니다.')).toBeVisible();
    await page.waitForURL('**/community/seminar');
    await expect(
      page.getByRole('heading', { name: titleEdited }),
    ).toHaveCount(0);
  });
});
