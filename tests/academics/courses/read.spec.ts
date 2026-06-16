import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';
import { ACADEMICS_SEED } from '../../setup/seed/academics';

/** 읽기(비로그인·비변경). 교과목 목록(createCourse API로 1개 시드, CourseCard가 name/code 렌더). */
const C = ACADEMICS_SEED.course;

test.describe('교과목 - 읽기', () => {
  test('목록 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/academics/undergraduate/courses');
    expect(res?.status()).toBe(200);
    await expect(page.getByText(C.ko.name).first()).toBeVisible();
    await expect(page.getByText(C.code).first()).toBeVisible();
    await expect(page).toHaveScreenshot('courses-ko.png', { fullPage: true });
  });
});
