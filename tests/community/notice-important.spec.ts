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

test('메인 중요 안내 설정 검증', async ({ page }) => {
  const dateTimeString = getKoreanDateTime();
  const title = `메인 테스트 ${dateTimeString}`;
  const description = `메인 내용 ${dateTimeString}`;

  // === 1단계: 메인 중요 안내 공지사항 작성 ===
  await page.goto('/community/notice');
  await loginAsStaff(page);
  await page.getByRole('link', { name: '새 게시글' }).click();
  await page.waitForURL('**/community/notice/create');

  await fillTextInput(page, 'title', title);
  await fillHTMLEditor(page, description);

  // 메인-중요 안내에 표시 체크
  await toggleCheckbox(page, '메인-중요 안내에 표시');

  await submitForm(page, '게시하기');
  await page.waitForURL(/\/community\/notice\/\d+$/);

  const url = page.url();
  const noticeId = url.match(/\/community\/notice\/(\d+)$/)?.[1];
  expect(noticeId).toBeDefined();

  // === 2단계: 내용 확인 ===
  await expect(page.locator('body')).toContainText(title);
  await expect(page.locator('body')).toContainText(description);

  // === 3단계: 메인 페이지에서 확인 ===
  await page.goto('/');
  // 메인 페이지의 중요 안내 섹션에 제목이 있어야 함
  await expect(page.locator('body')).toContainText(title);

  // === 4단계: 삭제 ===
  await page.goto(`/community/notice/${noticeId}`);
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL(/\/community\/notice\/edit\/\d+$/);
  await deleteItem(page);
  await page.waitForURL('**/community/notice');
});
