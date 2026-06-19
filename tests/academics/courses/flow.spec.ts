import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import { deleteItem, fillTextArea, fillTextInput } from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/**
 * 교과목(courses) CRUD: 추가(모달)→목록에 나타남→상세 모달 편집→반영→삭제→사라짐.
 * staff 전용 UI(`LoginVisible ROLE_STAFF`): '새 교과목' 버튼, 상세 모달의 편집/삭제.
 * 교과목 번호(code)는 PK(추후 수정 불가)라 고유값 사용. 학점/학년/구분 드롭다운은 기본값 그대로.
 * 목록 행은 `course[locale].name` 버튼 → 클릭 시 상세 모달.
 */
test.describe('교과목 - 추가/편집/삭제 플로우', () => {
  test('staff가 교과목을 추가→편집→삭제한다', async ({ page }) => {
    const sfx = Date.now();
    const code = `AUTO${sfx}`;
    const koName = `자동화교과목 ${sfx}`;
    const enName = `Automation Course ${sfx}`;
    const koNameEdited = `${koName} (수정)`;

    await setLocale(page, 'ko');
    await page.goto('/academics/undergraduate/courses');
    await loginAsStaff(page);

    // === 추가 === (모달)
    await page.getByRole('button', { name: '새 교과목' }).click();
    await fillTextInput(page, 'ko.name', koName);
    await fillTextArea(page, 'ko.description', '한글 교과목 설명');
    await fillTextInput(page, 'code', code);
    await fillTextInput(page, 'en.name', enName);
    await fillTextArea(page, 'en.description', 'English course description');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText('새 교과목을 추가했습니다.')).toBeVisible();

    // 목록에 실제로 나타남(행 버튼 = 교과목명)
    await expect(page.getByRole('button', { name: koName })).toBeVisible();

    // === en round-trip === (/en 목록에 입력한 en 이름 노출; 상세는 모달)
    await setLocale(page, 'en');
    await page.goto('/en/academics/undergraduate/courses');
    await expect(page.getByRole('button', { name: enName })).toBeVisible();
    await setLocale(page, 'ko');
    await page.goto('/academics/undergraduate/courses');

    // === 편집 === (행 클릭 → 상세 모달 → 편집 → 확인)
    await page.getByRole('button', { name: koName }).click();
    await page.getByRole('button', { name: '편집' }).click();
    await fillTextInput(page, 'ko.name', koNameEdited);
    await page.getByRole('button', { name: '확인' }).click();
    await expect(page.getByText('교과목을 수정했습니다.')).toBeVisible();
    // 모달 뷰어에 수정된 이름 반영
    await expect(
      page.getByRole('dialog').getByText(koNameEdited),
    ).toBeVisible();

    // === 삭제 === (상세 뷰어 삭제 → 확인 '삭제')
    await deleteItem(page, '삭제');
    await expect(page.getByText('교과목을 삭제했습니다.')).toBeVisible();
    await expect(page.getByRole('button', { name: koNameEdited })).toHaveCount(
      0,
    );
  });
});
