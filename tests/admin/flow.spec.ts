import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../helpers/auth';
import { fillHTMLEditor, fillTextInput, submitForm } from '../helpers/forms';
import { setLocale } from '../helpers/locale';

/**
 * 관리자 기능 종단 검증. baseline을 건드리지 않도록 각 loop가 자기 데이터를 만들고 정리한다.
 *  1) 슬라이드 관리: 슬라이드 표시 새소식 작성 → /admin 슬라이드 목록 노출 → 일괄 해제
 *  2) 중요 안내 관리: 중요 표시 공지 작성 → /admin 중요 목록 노출 → 일괄 해제
 *  3) 이미지 팝업 관리: 등록(이미지 업로드) → 수정 → 삭제 (백엔드 #396)
 *
 * AdminTable 체크박스는 appearance-none input이라 직접 체크가 어려워 감싸는 label을 클릭한다.
 */
// 1x1 PNG (createImageBitmap 디코딩 가능)
const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

/**
 * 로그인 읽기: /admin은 비로그인 read가 없으므로(loader가 쿠키 없으면 빈 응답) flow에 둔다.
 * 3개 관리 메뉴(슬라이드/중요안내/이미지팝업) 셸이 staff에게 렌더되는지만 확인(비주얼 안 만듦).
 */
test.describe('관리자 메뉴 - 로그인 읽기', () => {
  test('staff에게 관리 메뉴가 렌더된다 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/admin');
    await loginAsStaff(page);

    await expect(page.getByText('슬라이드쇼 관리').first()).toBeVisible();
    await expect(page.getByText('중요 안내 관리').first()).toBeVisible();
    await expect(page.getByText('이미지 팝업 관리').first()).toBeVisible();
    // 기본 선택(슬라이드) 관리 셸
    await expect(page.getByText('개의 게시물', { exact: false })).toBeVisible();
  });
});

test.describe('관리자 기능 - 종단 검증', () => {
  test('슬라이드 관리: 표시 글이 목록에 뜨고 해제된다', async ({ page }) => {
    const title = `슬라이드뉴스 ${Date.now()}`;
    await setLocale(page, 'ko');
    await page.goto('/community/news');
    await loginAsStaff(page);

    // 슬라이드 표시 새소식 작성
    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/news/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>슬라이드 본문</p>');
    await page.getByText('메인-슬라이드쇼에 표시').click();
    await submitForm(page, '게시하기');
    await expect(page.getByText('새소식을 게시했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/news\/\d+/);

    // /admin 슬라이드 목록에 노출
    await page.goto('/admin');
    await expect(page.getByRole('link', { name: title })).toBeVisible();

    // 선택 후 일괄 슬라이드 해제 (체크박스 label 클릭)
    const row = page.locator('li').filter({ hasText: title });
    await row.locator('label').first().click();
    await page.getByRole('button', { name: '일괄 슬라이드 해제' }).click();
    await page.getByRole('button', { name: '해제' }).last().click();
    await expect(page.getByText('슬라이드를 해제했습니다.')).toBeVisible();
    await expect(page.getByRole('link', { name: title })).toHaveCount(0);
  });

  test('중요 안내 관리: 표시 글이 목록에 뜨고 해제된다', async ({ page }) => {
    const title = `중요공지 ${Date.now()}`;
    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);

    // 중요 표시 공지 작성
    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/notice/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>중요 본문</p>');
    await page.getByText('메인-중요 안내에 표시').click();
    await submitForm(page, '게시하기');
    await expect(page.getByText('공지사항을 게시했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/notice\/\d+/);

    // /admin 중요 안내 목록
    await page.goto('/admin?selected=important');
    await expect(page.getByRole('link', { name: title })).toBeVisible();

    const row = page.locator('li').filter({ hasText: title });
    await row.locator('label').first().click();
    await page.getByRole('button', { name: '일괄 중요 안내 해제' }).click();
    await page.getByRole('button', { name: '해제' }).last().click();
    await expect(page.getByText('중요 안내를 해제했습니다.')).toBeVisible();
    await expect(page.getByRole('link', { name: title })).toHaveCount(0);
  });

  test('이미지 팝업 관리: 등록→수정→삭제', async ({ page }) => {
    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);
    await page.goto('/admin?selected=imageModal');

    // 등록 (이미지 업로드 필수 + 표시 종료일 displayUntil)
    await page
      .locator('input[type="file"]')
      .setInputFiles({ name: 'popup.png', mimeType: 'image/png', buffer: PNG_1x1 });
    await fillTextInput(page, 'externalLink', 'https://popup.example.com');
    await page
      .locator('input[name="displayUntil"]')
      .fill('2099-12-31T23:59');
    await page.getByRole('button', { name: '등록하기' }).click();
    await expect(page.getByText('이미지 팝업을 등록했습니다.')).toBeVisible();
    // 표시 종료일이 저장·재로딩되어 폼에 반영(프론트 displayUntil 와이어링 round-trip)
    await expect(page.locator('input[name="displayUntil"]')).toHaveValue(
      /2099-12-31/,
    );

    // 수정 (등록 후 편집 모드: 저장하기/삭제 노출)
    await fillTextInput(page, 'externalLink', 'https://popup-edited.example.com');
    await page.getByRole('button', { name: '저장하기' }).click();
    await expect(page.getByText('이미지 팝업을 수정했습니다.')).toBeVisible();

    // 삭제 (Form.Action 삭제 → 확인). 이미지 뷰어의 '삭제'와 구분되도록 last.
    await page.getByRole('button', { name: '삭제' }).last().click();
    await page.getByRole('button', { name: '확인' }).last().click();
    await expect(page.getByText('이미지 팝업을 삭제했습니다.')).toBeVisible();
  });
});
