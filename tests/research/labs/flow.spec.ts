import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import {
  deleteItem,
  fillHTMLEditor,
  fillTextInput,
  selectDropdown,
  submitForm,
  switchEditorLanguage,
} from '../../helpers/forms';
import { expectEnDetailHeading, setLocale } from '../../helpers/locale';
import { RESEARCH_SEED } from '../../setup/seed/research';

/**
 * 기능 플로우 (stateful, 실서버 영속성 기반):
 *   생성 → 목록에 나타남 → 편집 → 반영됨 → 삭제 → 사라짐.
 *
 * 로컬 docker 백엔드가 실제로 영속하므로 "내가 만든 항목이 목록에 보이는가"를 직접
 * 검증합니다(옛 테스트가 하던 진짜 검증). read 프로젝트 이후에 실행되고, baseline을
 * 건드리지 않으며 자기 항목만 생성/삭제하므로 다른 테스트와 격리됩니다.
 * 고유 이름(타임스탬프)으로 병렬 flow 간 충돌도 방지합니다.
 */
test.describe('연구실 - 추가/편집/삭제 플로우', () => {
  test('staff가 연구실을 추가→편집→삭제한다', async ({ page }) => {
    const sfx = Date.now();
    const koName = `자동화 연구실 ${sfx}`;
    const enName = `Automation Lab ${sfx}`;
    const koNameEdited = `${koName} (수정)`;
    const stream = (lang: 'ko' | 'en') => `${RESEARCH_SEED.group[lang]} 스트림`;

    await setLocale(page, 'ko');
    await page.goto('/research/labs');
    await loginAsStaff(page);

    // === 추가 ===
    await page.getByRole('link', { name: '연구실 추가' }).click();
    await page.waitForURL('**/research/labs/create');

    await fillTextInput(page, 'ko.name', koName);
    await selectDropdown(page, '연구·교육 스트림', stream('ko'));
    await fillHTMLEditor(page, '<p>한글 설명</p>');
    await switchEditorLanguage(page, 'en');
    await fillTextInput(page, 'en.name', enName);
    await selectDropdown(page, '연구·교육 스트림', stream('en'));
    await fillHTMLEditor(page, '<p>English description</p>');

    await submitForm(page);
    // 성공은 영속 결과(목록 복귀 + 항목 출현)로 검증. ephemeral 토스트는 풀 병렬 부하에서
    // 실서버 multipart 지연 시 5초 안에 못 떠 flaky → 단언 제거(waitForURL은 30s라 견고).
    await page.waitForURL('**/research/labs');

    // 목록에 실제로 나타남
    await expect(page.getByRole('link', { name: koName })).toBeVisible();

    // === 편집 ===
    await page.getByRole('link', { name: koName }).click();
    await page.waitForURL(/\/research\/labs\/\d+$/);
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/research\/labs\/\d+\/edit$/);

    await fillTextInput(page, 'ko.name', koNameEdited);
    await submitForm(page);
    await expect(page.getByText('연구실을 수정했습니다.')).toBeVisible();

    // 상세에 수정된 이름이 반영됨
    await expect(
      page.getByRole('heading', { name: koNameEdited }),
    ).toBeVisible();

    // === en round-trip === (/en 상세에 입력한 en 이름이 노출되는지)
    await expectEnDetailHeading(page, enName);

    // === 삭제 ===
    await page.getByRole('link', { name: '편집' }).click();
    await page.waitForURL(/\/research\/labs\/\d+\/edit$/);
    await deleteItem(page);
    await expect(page.getByText('연구실을 삭제했습니다.')).toBeVisible();
    await page.waitForURL('**/research/labs');

    // 목록에서 사라짐
    await expect(
      page.getByRole('link', { name: koNameEdited }),
    ).not.toBeVisible();
  });
});
