import { expect, type Page } from '@playwright/test';

export async function fillTextInput(page: Page, name: string, value: string) {
  await page.locator(`input[name="${name}"]`).fill(value);
}

export async function fillHTMLEditor(
  page: Page,
  content: string,
  name?: string,
) {
  if (name) {
    // 에디터 초기화 대기 (비동기 로딩)
    await page.waitForFunction(
      (editorName) => {
        const editors = (window as unknown as Record<string, unknown>)
          .__suneditors as Record<string, unknown> | undefined;
        return editors?.[editorName] !== undefined;
      },
      name,
      { timeout: 10000 },
    );

    // 전역 suneditor 인스턴스의 setValue 사용 (react-hook-form 연동)
    await page.evaluate(
      ({ name, content }) => {
        const editors = (window as unknown as Record<string, unknown>)
          .__suneditors as Record<string, { setValue: (c: string) => void }>;
        editors[name].setValue(content);
      },
      { name, content },
    );
  } else {
    // visible 에디터에 직접 입력 (클립보드 사용)
    const editor = page.locator('.sun-editor-editable:visible');
    await editor.click();
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Backspace');

    // 클립보드에 복사 후 붙여넣기 (onChange 트리거)
    await page.evaluate((text) => navigator.clipboard.writeText(text), content);
    await page.keyboard.press('Meta+V');
    await page.waitForTimeout(100);
  }
}

export async function switchEditorLanguage(page: Page, lang: 'ko' | 'en') {
  await page.locator(`label[for="${lang}"]`).click();
  await page.waitForTimeout(300);
}

export async function uploadImage(page: Page, imagePath: string) {
  const fileInput = page.locator('label:has-text("이미지") input[type="file"]');
  await fileInput.setInputFiles(imagePath);
}

export async function uploadFiles(
  page: Page,
  filePaths: string | string[],
  fieldsetName = '첨부파일',
) {
  const fieldset = page.getByRole('group', { name: fieldsetName });
  const fileInput = fieldset.locator('input[type="file"]');
  await fileInput.setInputFiles(filePaths);
}

export async function clearAllFiles(page: Page, fieldsetName = '첨부파일') {
  const fieldset = page.getByRole('group', { name: fieldsetName });
  const deleteButtons = fieldset.getByRole('button', { name: '삭제' });
  while ((await deleteButtons.count()) > 0) {
    await deleteButtons.first().click();
  }
}

export async function fillTextList(
  page: Page,
  fieldsetName: string,
  values: string[],
) {
  const fieldset = page.getByRole('group', { name: fieldsetName });
  for (const value of values) {
    await fieldset.locator('input').first().fill(value);
    await fieldset.getByRole('button', { name: '추가' }).click();
  }
}

export async function selectDropdown(
  page: Page,
  fieldsetName: string,
  optionLabel: string,
) {
  const fieldset = page.getByRole('group', { name: fieldsetName });
  await fieldset.getByRole('button').first().click();
  await page.getByText(optionLabel, { exact: true }).click();
}

export async function selectRadio(page: Page, label: string) {
  await page.getByRole('radio', { name: label }).click();
}

export async function selectDate(page: Page, fieldsetName: string, date: Date) {
  const fieldset = page.getByRole('group', { name: fieldsetName });
  await fieldset.getByRole('button').first().click();
  await page.waitForSelector('.custom-calendar');
  const day = date.getDate();
  await page
    .locator('.custom-calendar button.rdp-day_button')
    .filter({ hasText: new RegExp(`^${day}$`) })
    .click();
}

export async function toggleCheckbox(
  page: Page,
  label: string,
  checked = true,
) {
  const checkbox = page.getByRole('checkbox', { name: label });
  const isChecked = await checkbox.isChecked();
  if (isChecked !== checked) {
    await page.getByText(label, { exact: true }).click();
  }
}

export async function submitForm(page: Page, buttonName = '저장하기') {
  await page.getByRole('button', { name: buttonName }).click();
  await page.waitForLoadState('load');
}

export async function deleteItem(page: Page) {
  await page.getByRole('button', { name: '삭제' }).last().click();
  await page.getByRole('button', { name: '확인' }).click();
  await page.waitForLoadState('load');
}
