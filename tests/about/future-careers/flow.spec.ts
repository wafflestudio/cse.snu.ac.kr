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
 * future-careers는 한 페이지에 편집 진입점이 3개라 각각 별도 flow로 검증한다.
 *  1) description 싱글톤 편집(PUT) — 별도 편집 페이지(suneditor)
 *  2) 연도별 통계 추가/편집(stat POST/PUT) — 별도 추가·편집 페이지
 *  3) 창업 기업 추가/편집/삭제(company POST/PUT/DELETE) — 인라인 행 CRUD
 */
test.describe('졸업생 진로 - 편집 플로우', () => {
  test('staff가 진로 본문을 수정하면 반영된다', async ({ page }) => {
    const koText = `수정된 진로 본문 ${Date.now()}`;
    const enText = `Edited careers ${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto('/about/future-careers');
    await loginAsStaff(page);

    // 상단 본문 편집 링크(stat/company 편집과 구분되도록 href로 스코프)
    await page
      .locator('[href*="/about/future-careers/description/edit"]')
      .click();
    await page.waitForURL('**/about/future-careers/description/edit');

    await fillHTMLEditor(page, koText);
    await switchEditorLanguage(page, 'en');
    await fillHTMLEditor(page, enText);

    await submitForm(page);
    await page.waitForURL('**/about/future-careers');
    await expect(page.getByText(koText)).toBeVisible();

    // === en round-trip === (/en 본문에 입력한 en 값 노출 — description 싱글톤)
    await setLocale(page, 'en');
    await page.goto('/en/about/future-careers');
    await expect(page.getByText(enText)).toBeVisible();
  });

  test('staff가 연도별 통계를 추가→편집한다', async ({ page }) => {
    // 베이스라인(2024)과 충돌하지 않는 고유 연도(409 회피)
    const year = '2099';

    await setLocale(page, 'ko');
    await page.goto('/about/future-careers');
    await loginAsStaff(page);

    // === 연도 추가 ===
    await page.getByRole('link', { name: '연도 추가' }).click();
    await page.waitForURL('**/about/future-careers/stat/create');
    await fillTextInput(page, 'year', year);
    await fillTextInput(page, 'statList.0.bachelor', '77'); // 삼성/학부
    await submitForm(page);
    await expect(
      page.getByText('졸업생 진로 현황을 추가했습니다.'),
    ).toBeVisible();
    await page.waitForURL('**/about/future-careers');
    // 추가한 연도가 maxYear라 dropdown 기본 선택 → 표에 반영
    // (Dropdown은 Radix Select → 트리거 role=combobox, 선택 연도는 트리거 텍스트로 노출)
    await expect(page.getByRole('combobox')).toContainText(year);
    // exact: 연도 옵션(예: 2077)에 '77'이 부분일치하지 않도록
    await expect(page.getByText('77', { exact: true })).toBeVisible();

    // === 편집 === (현재 선택된 연도의 통계 편집)
    await page.locator('[href*="/about/future-careers/stat/edit"]').click();
    await page.waitForURL('**/about/future-careers/stat/edit**');
    await fillTextInput(page, 'statList.0.bachelor', '88');
    await submitForm(page);
    await expect(
      page.getByText('졸업생 진로 현황을 수정했습니다.'),
    ).toBeVisible();
    await page.waitForURL('**/about/future-careers');
    await expect(page.getByText('88', { exact: true })).toBeVisible();
  });

  test('staff가 창업 기업을 추가→편집→삭제한다', async ({ page }) => {
    const name = `자동화기업${Date.now()}`;
    const nameEdited = `${name}수정`;

    await setLocale(page, 'ko');
    await page.goto('/about/future-careers');
    await loginAsStaff(page);

    // === 추가 (인라인) ===
    await page.getByRole('button', { name: '기업 추가' }).click();
    await fillTextInput(page, 'name', name);
    await fillTextInput(page, 'url', 'https://auto.example.com');
    await fillTextInput(page, 'year', '2025');
    await page.getByRole('button', { name: '저장' }).click();
    // 추가 성공 후 window.location.reload() → 토스트 대신 행 출현으로 검증
    const row = page.locator('li').filter({ hasText: name });
    await expect(row).toBeVisible();

    // === 편집 (인라인 행) ===
    await row.getByRole('button', { name: '편집' }).click();
    await fillTextInput(page, 'name', nameEdited);
    await page.getByRole('button', { name: '저장' }).click();
    await expect(
      page.getByText('졸업생 창업 기업을 수정했습니다.'),
    ).toBeVisible();
    const editedRow = page.locator('li').filter({ hasText: nameEdited });
    await expect(editedRow).toBeVisible();

    // === 삭제 (행 스코프 삭제 트리거 → 확인 '삭제') ===
    await deleteItem(
      page,
      '삭제',
      editedRow.getByRole('button', { name: '삭제' }),
    );
    await expect(
      page.getByText('졸업생 창업 기업을 삭제했습니다.'),
    ).toBeVisible();
    await expect(
      page.locator('li').filter({ hasText: nameEdited }),
    ).toHaveCount(0);
  });
});
