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
 * 연도 타임라인(curriculum/general-studies/course-changes) 연도 CRUD.
 * baseline(2024)을 건드리지 않도록 고유 연도(2099) 추가→편집→삭제. OrderByYearDesc라 추가 직후 선택됨.
 * 편집 시 연도 필드는 disabled, 본문만 수정. 삭제 확인 라벨 '삭제'.
 */
const ROUTES = [
  { path: 'curriculum', addToast: '추가에 성공했습니다.', label: '전공이수' },
  {
    path: 'general-studies-requirements',
    addToast: '추가에 성공했습니다.',
    label: '교양이수',
  },
  {
    path: 'course-changes',
    addToast: '저장에 성공했습니다.',
    label: '교과변경',
  },
] as const;

for (const route of ROUTES) {
  test.describe(`연도 타임라인(${route.path}) - 추가/편집/삭제`, () => {
    test('staff가 연도를 추가→편집→삭제한다', async ({ page }) => {
      const base = `/academics/undergraduate/${route.path}`;
      const year = '2099';
      const desc = `${route.label} ${Date.now()}`;
      const descEdited = `${desc} 수정`;

      await setLocale(page, 'ko');
      await page.goto(base);
      await loginAsStaff(page);

      // 연도 추가
      await page.getByRole('link', { name: '연도 추가' }).click();
      await page.waitForURL(`**${base}/create`);
      await fillTextInput(page, 'year', year);
      await fillHTMLEditor(page, desc);
      await submitForm(page);
      await expect(page.getByText(route.addToast)).toBeVisible();
      await page.waitForURL(`**${base}`);
      await expect(page.getByText(desc)).toBeVisible();

      // 편집 (연도 disabled, 본문만)
      await page.getByRole('link', { name: '편집' }).click();
      await page.waitForURL(new RegExp(`${route.path}/edit/${year}`));
      await fillHTMLEditor(page, descEdited);
      await submitForm(page);
      await expect(page.getByText('수정에 성공했습니다.')).toBeVisible();
      await page.waitForURL(`**${base}`);
      await expect(page.getByText(descEdited)).toBeVisible();

      // 삭제 (ActionButtons 삭제 → 확인 '삭제')
      await deleteItem(page, '삭제');
      await expect(page.getByText('삭제에 성공했습니다.')).toBeVisible();
      await expect(page.getByText(descEdited)).toHaveCount(0);
    });
  });
}
