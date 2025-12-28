import { expect, test } from '@playwright/test';
import { loginAsStaff, logout } from '../helpers/auth';
import {
  deleteItem,
  fillHTMLEditor,
  fillTextInput,
  submitForm,
  toggleCheckbox,
} from '../helpers/form-components';
import { getKoreanDateTime } from '../helpers/utils';

test('비공개 글 설정 검증', async ({ page }) => {
  const dateTimeString = getKoreanDateTime();
  const title = `비공개 테스트 ${dateTimeString}`;
  const description = `비공개 내용 ${dateTimeString}`;

  // === 1단계: 비공개 공지사항 작성 ===
  await page.goto('/community/notice');
  await loginAsStaff(page);
  await page.getByRole('link', { name: '새 게시글' }).click();
  await page.waitForURL('**/community/notice/create');

  await fillTextInput(page, 'title', title);
  await fillHTMLEditor(page, description);

  // 비공개 글 체크
  await toggleCheckbox(page, '비공개 글');

  await submitForm(page, '게시하기');
  await page.waitForURL(/\/community\/notice\/\d+$/);

  const url = page.url();
  const noticeId = url.match(/\/community\/notice\/(\d+)$/)?.[1];
  expect(noticeId).toBeDefined();

  // === 2단계: 로그인 상태에서는 보임 ===
  await expect(page.locator('body')).toContainText(title);
  await expect(page.locator('body')).toContainText(description);

  // === 3단계: 로그아웃 후 접근 시도 ===
  await logout(page);
  await page.goto(`/community/notice/${noticeId}`);

  // 비공개 글은 로그아웃 상태에서 접근 불가 (404 또는 접근 제한 메시지)
  // 제목과 내용이 보이지 않아야 함
  await expect(page.locator('body')).not.toContainText(description);

  // === 4단계: 삭제 (다시 로그인) ===
  await loginAsStaff(page);
  await page.goto(`/community/notice/${noticeId}`);
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL(/\/community\/notice\/edit\/\d+$/);
  await deleteItem(page);
  await page.waitForURL('**/community/notice');
});
