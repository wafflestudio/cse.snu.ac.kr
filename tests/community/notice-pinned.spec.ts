import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../helpers/auth';
import {
  deleteItem,
  fillHTMLEditor,
  fillTextInput,
  submitForm,
  toggleCheckbox,
} from '../helpers/form-components';
import { getKoreanDateTime } from '../helpers/utils';

test('상단 고정 설정 검증', async ({ page }) => {
  const dateTimeString = getKoreanDateTime();
  const title = `고정 테스트 ${dateTimeString}`;
  const description = `고정 내용 ${dateTimeString}`;

  // === 1단계: 상단 고정 공지사항 작성 ===
  await page.goto('/community/notice');
  await loginAsStaff(page);
  await page.getByRole('link', { name: '새 게시글' }).click();
  await page.waitForURL('**/community/notice/create');

  await fillTextInput(page, 'title', title);
  await fillHTMLEditor(page, description);

  // 목록 상단에 고정 체크
  await toggleCheckbox(page, '목록 상단에 고정');

  await submitForm(page, '게시하기');
  await page.waitForURL(/\/community\/notice\/\d+$/);

  const url = page.url();
  const noticeId = url.match(/\/community\/notice\/(\d+)$/)?.[1];
  expect(noticeId).toBeDefined();

  // === 2단계: 내용 확인 ===
  await expect(page.locator('body')).toContainText(title);
  await expect(page.locator('body')).toContainText(description);

  // === 3단계: 목록에서 상단 고정 확인 ===
  await page.goto('/community/notice');
  // 첫 번째 게시물이 방금 작성한 고정 게시물이어야 함
  const firstNotice = page.locator('ul li').first();
  await expect(firstNotice).toContainText(title);

  // === 4단계: 삭제 ===
  await page.goto(`/community/notice/${noticeId}`);
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL(/\/community\/notice\/edit\/\d+$/);
  await deleteItem(page);
  await page.waitForURL('**/community/notice');
});
