import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Form 컴포넌트 구동 헬퍼.
 * 각 함수는 단일 책임만 가지며, 복합 동작(언어 전환 + 입력)은 스펙에서 조합합니다.
 * 검증이 아니라 "폼을 조작"하는 용도입니다.
 */

/** Form.Text — 현재 언어의 텍스트 필드에 입력 */
export async function fillTextInput(page: Page, name: string, value: string) {
  await page.locator(`input[name="${name}"]`).fill(value);
}

/** Form.TextArea — textarea 필드에 입력(예: 교과목 설명, 예약 사용목적) */
export async function fillTextArea(page: Page, name: string, value: string) {
  await page.locator(`textarea[name="${name}"]`).fill(value);
}

/** Form.HTML(suneditor) — 보이는 에디터에 입력.
 *  한 화면에 에디터가 여럿이면(예: seminar의 요약+연사소개) index로 대상 지정.
 *  (about 편집처럼 htmlKo/htmlEn 두 에디터가 동시에 마운트되면 보이는 쪽만 잡힌다) */
export async function fillHTMLEditor(page: Page, html: string, index = 0) {
  const editor = page.locator('.sun-editor-editable:visible').nth(index);
  // suneditor 초기화가 끝나 editable이 contenteditable이 될 때까지 대기(고정 슬립 아님).
  // 풀 병렬 부하에서 init 전 fill하면 "Element is not contenteditable" 발생 → 실제 신호로 대기.
  await expect(editor).toHaveAttribute('contenteditable', 'true');
  await editor.click();
  await editor.fill(html);
}

/** 폼 에디터의 한/영 전환 (라디오는 숨겨져 있어 label 클릭).
 *  고정 슬립 대신 라디오 checked(언어 상태 전환)를 실제 신호로 대기한다. */
export async function switchEditorLanguage(page: Page, lang: 'ko' | 'en') {
  await page.locator(`label[for="${lang}"]`).click();
  await expect(page.locator(`input#${lang}`)).toBeChecked();
}

/** Form.Dropdown — 필드셋을 열고 옵션 라벨로 선택 */
export async function selectDropdown(
  page: Page,
  fieldsetName: string,
  optionLabel: string,
) {
  const fieldset = page.getByRole('group', { name: fieldsetName });
  await fieldset.locator('button').first().click();
  await page.getByRole('button', { name: optionLabel, exact: true }).click();
}

/** 저장하기 버튼 클릭 */
export async function submitForm(page: Page, buttonName = '저장하기') {
  await page.getByRole('button', { name: buttonName }).click();
}

/**
 * 삭제 버튼 클릭 후 AlertDialog 확인까지 처리.
 * 확인 버튼 라벨은 컴포넌트마다 다르다(Form.Action='확인', ClubDetails='삭제').
 * 기본 트리거는 첫 '삭제' 버튼. 한 화면에 '삭제'가 여럿이면(예: 교수 편집 폼의 학력별 삭제 +
 * Form.Action 삭제) `trigger`로 명시(예: Form.Action 삭제 = `.last()`).
 * 확인 버튼은 항상 마지막('삭제' 트리거와 겹치지 않도록 last).
 */
export async function deleteItem(
  page: Page,
  confirmText = '확인',
  trigger?: Locator,
) {
  await (trigger ?? page.getByRole('button', { name: '삭제' }).first()).click();
  await page.getByRole('button', { name: confirmText }).last().click();
}
