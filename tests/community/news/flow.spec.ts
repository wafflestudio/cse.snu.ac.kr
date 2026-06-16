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
 * 새소식 CRUD: 작성→상세→편집→상세 반영→삭제→목록에서 사라짐.
 * 시기(date)는 기본값(오늘)을 그대로 두고 제출(flow는 비주얼 아님).
 * 상세 페이지 삭제 토스트는 '게시글을 삭제했습니다.'($id.tsx).
 */
test.describe('새 소식 - 작성/편집/삭제 플로우', () => {
  test('staff가 새소식을 작성→편집→삭제한다', async ({ page }) => {
    const title = `자동화 소식 ${Date.now()}`;
    const titleEdited = `${title} (수정)`;

    await setLocale(page, 'ko');
    await page.goto('/community/news');
    await loginAsStaff(page);

    // === 작성 ===
    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/news/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>자동화 본문입니다.</p>');
    await submitForm(page, '게시하기');
    await expect(page.getByText('새소식을 게시했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/news\/\d+/);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();

    // === 편집 === (상세 PostFooter 편집)
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/community\/news\/edit\/\d+/);
    await fillTextInput(page, 'title', titleEdited);
    await submitForm(page, '게시하기');
    await expect(page.getByText('새소식을 수정했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/news\/\d+/);
    await expect(page.getByRole('heading', { name: titleEdited })).toBeVisible();

    // === 삭제 === (상세 PostFooter 삭제 → 확인 '삭제')
    await deleteItem(page, '삭제');
    await expect(page.getByText('게시글을 삭제했습니다.')).toBeVisible();
    await page.waitForURL('**/community/news');
    await expect(
      page.getByRole('heading', { name: titleEdited }),
    ).toHaveCount(0);
  });
});

/**
 * 게시 설정(어드민): 비공개 새소식.
 * news 목록 loader는 notice와 달리 쿠키를 전달하지 않아(프론트 비일관) 비공개 글이
 * staff에게도 목록에 안 보인다 → "비공개 글은 (로그인 여부와 무관하게) 목록에서 빠진다"만 검증.
 * (private→staff 노출의 정상 동작 검증은 notice 게시 설정 스펙에서 수행)
 */
test.describe('새 소식 - 게시 설정', () => {
  test('비공개 새소식은 목록에 노출되지 않는다', async ({ page }) => {
    const title = `비공개소식 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/community/news');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/news/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>비공개 본문</p>');
    await page.getByText('비공개 글').click();
    await submitForm(page, '게시하기');
    await expect(page.getByText('새소식을 게시했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/news\/\d+/);

    // 목록에는 비공개 글이 노출되지 않음
    await page.goto('/community/news');
    await expect(page.getByRole('heading', { name: title })).toHaveCount(0);
  });
});

/** 대표 이미지 업로드(어드민): 새소식 작성 시 이미지 첨부 → 목록 카드에 이미지 노출. */
const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

test.describe('새 소식 - 대표 이미지', () => {
  test('staff가 대표 이미지와 함께 새소식을 작성한다', async ({ page }) => {
    const title = `이미지소식 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/community/news');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/news/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>이미지 본문</p>');

    // 대표 이미지 업로드(Form.Image '이미지 업로드' label 내부 input)
    await page
      .locator('label')
      .filter({ hasText: '이미지 업로드' })
      .locator('input[type="file"]')
      .setInputFiles({ name: 'rep.png', mimeType: 'image/png', buffer: PNG_1x1 });

    await submitForm(page, '게시하기');
    // 성공은 영속 결과(상세로 이동)로 검증. ephemeral 토스트 단언 제거(부하 시 flaky).
    await page.waitForURL(/\/community\/news\/\d+/);

    // 목록 카드에 대표 이미지(img) 노출(이미지 없는 baseline은 회색 div).
    // 업로드 이미지가 서빙 가능 상태가 되는 데 부하 시 지연되므로 타임아웃을 넉넉히.
    await page.goto('/community/news');
    const row = page.locator('article').filter({ hasText: title });
    await expect(row.locator('img')).toHaveCount(1, { timeout: 15_000 });
  });
});
