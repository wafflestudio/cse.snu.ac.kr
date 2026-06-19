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
 * 공지 CRUD: 작성→상세→편집→상세 반영→삭제→목록에서 사라짐.
 * baseline을 건드리지 않도록 고유 제목(Date.now())을 쓴다.
 * 상세 페이지의 삭제 토스트는 '게시글을 삭제했습니다.'($id.tsx).
 */
test.describe('공지사항 - 작성/편집/삭제 플로우', () => {
  test('staff가 공지를 작성→편집→삭제한다', async ({ page }) => {
    const title = `자동화 공지 ${Date.now()}`;
    const titleEdited = `${title} (수정)`;

    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);

    // === 작성 ===
    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/notice/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>자동화 본문입니다.</p>');
    await submitForm(page, '게시하기');
    await expect(page.getByText('공지사항을 게시했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/notice\/\d+/);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();

    // === 편집 === (상세 PostFooter 편집)
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/community\/notice\/edit\/\d+/);
    await fillTextInput(page, 'title', titleEdited);
    await submitForm(page, '게시하기');
    await expect(page.getByText('공지사항을 수정했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/notice\/\d+/);
    await expect(
      page.getByRole('heading', { name: titleEdited }),
    ).toBeVisible();

    // === 삭제 === (상세 PostFooter 삭제 → 확인 '삭제')
    await deleteItem(page, '삭제');
    await expect(page.getByText('게시글을 삭제했습니다.')).toBeVisible();
    await page.waitForURL('**/community/notice');
    await expect(page.getByRole('link', { name: titleEdited })).toHaveCount(0);
  });
});

/**
 * 게시 설정(어드민 기능): 비공개/목록 상단 고정.
 * - 비공개 글: staff에게만 노출(백엔드가 비-staff에게 필터).
 * - 목록 상단 고정: pinned가 목록 맨 위로 부상.
 */
test.describe('공지사항 - 게시 설정', () => {
  test('비공개 글은 staff에게만 보인다', async ({ page }) => {
    const title = `비공개공지 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/notice/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>비공개 본문</p>');
    await page.getByText('비공개 글').click(); // 게시 설정 체크박스
    await submitForm(page, '게시하기');
    await expect(page.getByText('공지사항을 게시했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/notice\/\d+/);

    // staff 목록에는 보인다
    await page.goto('/community/notice');
    await expect(page.getByRole('link', { name: title })).toBeVisible();

    // 로그아웃(쿠키 제거) → 비공개 글은 숨겨진다
    await page.context().clearCookies();
    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await expect(page.getByRole('link', { name: title })).toHaveCount(0);
  });

  test('고정한 공지는 목록 행에 핀 아이콘이 표시된다', async ({ page }) => {
    const title = `고정공지 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/notice/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>고정 본문</p>');
    await page.getByText('목록 상단에 고정').click();
    await submitForm(page, '게시하기');
    await expect(page.getByText('공지사항을 게시했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/notice\/\d+/);

    // 고정 글은 목록 행에 핀 아이콘이 렌더된다(프론트 조건부 `post.isPinned && <PinIcon/>`).
    // 상단 부상 = 백엔드 정렬이라 위치 비교(boundingBox) 대신 프론트 렌더만 검증.
    // 생성한 공지는 첨부/비공개가 없어 행의 유일한 svg = 핀 아이콘.
    await page.goto('/community/notice');
    const row = page.locator('li').filter({ hasText: title });
    await expect(row).toBeVisible();
    await expect(row.locator('svg').first()).toBeVisible();
  });

  test('중요 안내는 메인용 제목(titleForMain)으로 메인에 노출된다', async ({
    page,
  }) => {
    const title = `중요원제목 ${Date.now()}`;
    const titleForMain = `메인용제목 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/notice/create');
    await fillTextInput(page, 'title', title);
    await fillTextInput(page, 'titleForMain', titleForMain);
    await fillHTMLEditor(page, '<p>중요 본문</p>');
    await page.getByText('메인-중요 안내에 표시').click(); // isImportant
    await submitForm(page, '게시하기');
    await expect(page.getByText('공지사항을 게시했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/notice\/\d+/);

    // 메인 중요안내 섹션은 titleForMain(메인용 제목)으로 노출
    await page.goto('/');
    await expect(page.getByText(titleForMain).first()).toBeVisible();

    // 목록에는 원 제목으로 노출
    await page.goto('/community/notice');
    await expect(page.getByRole('link', { name: title })).toBeVisible();
  });
});

/**
 * 목록 편집모드 일괄 관리(어드민): 일괄 삭제 / 일괄 고정 해제.
 * 편집모드에선 제목이 link가 아니라 span이 되므로 getByText로 검증. 체크박스는 행의 label 클릭.
 */
test.describe('공지사항 - 목록 일괄 관리', () => {
  async function createNotice(
    page: import('@playwright/test').Page,
    title: string,
    pinned = false,
  ) {
    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/notice/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>본문</p>');
    if (pinned) await page.getByText('목록 상단에 고정').click();
    await submitForm(page, '게시하기');
    await page.waitForURL(/\/community\/notice\/\d+/);
    await page.goto('/community/notice');
  }

  test('staff가 공지를 일괄 삭제한다', async ({ page }) => {
    const t1 = `일괄삭제A ${Date.now()}`;
    const t2 = `일괄삭제B ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);
    await createNotice(page, t1);
    await createNotice(page, t2);

    // 편집모드 진입 → 두 글 선택 → 일괄 삭제
    await page.getByRole('button', { name: '편집' }).click();
    await page
      .locator('li')
      .filter({ hasText: t1 })
      .locator('label')
      .first()
      .click();
    await page
      .locator('li')
      .filter({ hasText: t2 })
      .locator('label')
      .first()
      .click();
    await page.getByRole('button', { name: '일괄 삭제' }).click();
    await page.getByRole('button', { name: '삭제' }).last().click();
    await expect(page.getByText('선택된 공지를 삭제했습니다.')).toBeVisible();
    await expect(page.getByText(t1)).toHaveCount(0);
    await expect(page.getByText(t2)).toHaveCount(0);
  });

  test('staff가 공지를 일괄 고정 해제한다', async ({ page }) => {
    const title = `일괄고정해제 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);
    await createNotice(page, title, true); // 고정으로 생성

    // 고정 상태: baseline 비고정 공지보다 위
    const pinnedBox1 = await page.getByText(title).first().boundingBox();
    const normalBox1 = await page
      .getByText('학사 일정 안내')
      .first()
      .boundingBox();
    expect(pinnedBox1 && normalBox1 && pinnedBox1.y < normalBox1.y).toBe(true);

    // 편집모드 → 선택 → 일괄 고정 해제
    await page.getByRole('button', { name: '편집' }).click();
    await page
      .locator('li')
      .filter({ hasText: title })
      .locator('label')
      .first()
      .click();
    await page.getByRole('button', { name: '일괄 고정 해제' }).click();
    await page.getByRole('button', { name: '고정 해제' }).last().click();
    await expect(
      page.getByText('선택된 공지를 고정 해제했습니다.'),
    ).toBeVisible();

    // 고정 해제됨: 여전히 고정인 baseline '장학금 신청 공지'보다 아래로 내려감
    const myBox2 = await page.getByText(title).first().boundingBox();
    const stillPinnedBox2 = await page
      .getByText('장학금 신청 공지')
      .first()
      .boundingBox();
    expect(myBox2 && stillPinnedBox2 && myBox2.y > stillPinnedBox2.y).toBe(
      true,
    );
  });
});

/** 첨부파일(어드민): 공지 작성 시 파일 업로드 → 상세에 파일명 노출. */
test.describe('공지사항 - 첨부파일', () => {
  test('staff가 첨부파일과 함께 공지를 작성한다', async ({ page }) => {
    const title = `첨부공지 ${Date.now()}`;
    const fileName = `첨부문서-${Date.now()}.txt`;

    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/notice/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>첨부 본문</p>');

    // 첨부파일 업로드 ('파일 선택' label 내부의 input)
    await page
      .locator('label')
      .filter({ hasText: '파일 선택' })
      .locator('input[type="file"]')
      .setInputFiles({
        name: fileName,
        mimeType: 'text/plain',
        buffer: Buffer.from('attachment content'),
      });
    // 폼에 선택된 파일명 표시 확인
    await expect(page.getByText(fileName)).toBeVisible();

    await submitForm(page, '게시하기');
    await expect(page.getByText('공지사항을 게시했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/notice\/\d+/);

    // 상세 Attachments에 파일명 노출
    await expect(page.getByText(fileName)).toBeVisible();
  });
});

/** 태그 선택(어드민): 공지 작성 시 태그 체크 → 상세에 태그 노출. */
test.describe('공지사항 - 태그', () => {
  test('staff가 태그를 선택해 공지를 작성한다', async ({ page }) => {
    const title = `태그공지 ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/community/notice');
    await loginAsStaff(page);

    await page.getByRole('link', { name: '새 게시글' }).click();
    await page.waitForURL('**/community/notice/create');
    await fillTextInput(page, 'title', title);
    await fillHTMLEditor(page, '<p>태그 본문</p>');
    await page.getByText('장학', { exact: true }).click(); // 태그 체크박스
    await submitForm(page, '게시하기');
    await expect(page.getByText('공지사항을 게시했습니다.')).toBeVisible();
    await page.waitForURL(/\/community\/notice\/\d+/);

    // 상세에 '장학' 태그(링크) 노출
    await expect(page.getByRole('link', { name: '장학' })).toBeVisible();
  });
});
