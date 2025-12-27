import { expect, type Page } from '@playwright/test';

export async function loginAsStaff(page: Page) {
  await page.getByRole('button', { name: 'STAFF' }).click();
  await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible();
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: '로그아웃' }).click();
}
