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
  {
    path: 'curriculum',
    addToast: '전공 이수 표준 형태를 추가했습니다.',
    editToast: '전공 이수 표준 형태를 수정했습니다.',
    deleteToast: '2099학번 전공 이수 표준 형태를 삭제했습니다.',
    label: '전공이수',
  },
  {
    path: 'general-studies-requirements',
    addToast: '필수 교양 과목을 추가했습니다.',
    editToast: '필수 교양 과목을 수정했습니다.',
    deleteToast: '2099학번 영역별 교양과목 학점 배분 구조표를 삭제했습니다.',
    label: '교양이수',
  },
  {
    path: 'course-changes',
    addToast: '교과목 변경 내역을 추가했습니다.',
    editToast: '교과목 변경 내역을 수정했습니다.',
    deleteToast: '2099학년도 교과목 변경 내역을 삭제했습니다.',
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
      await expect(page.getByText(route.editToast)).toBeVisible();
      await page.waitForURL(`**${base}`);
      await expect(page.getByText(descEdited)).toBeVisible();

      // 삭제 (ActionButtons 삭제 → 확인 '삭제')
      await deleteItem(page, '삭제');
      await expect(page.getByText(route.deleteToast)).toBeVisible();
      await expect(page.getByText(descEdited)).toHaveCount(0);
    });
  });
}
