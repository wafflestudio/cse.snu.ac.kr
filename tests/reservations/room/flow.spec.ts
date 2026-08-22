import { expect, type Page, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import { deleteItem, fillTextArea, fillTextInput } from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/**
 * 시설 예약 플로우. STAFF는 예약 권한(hasAnyRole STAFF/RESERVATION/LABMASTER) 보유.
 *
 * 결정론: 모달 기본값은 "오늘 가장 이른 가용 슬롯"이라 **시각 의존**(늦은 밤엔 익일 8:00로 롤오버,
 * 종일 슬롯·캘린더 가장자리 블록이 클릭 불안정)이었다. 시각 무관하게 만들려고 날짜 피커에서
 * **다음 달 15일**(항상 미래·월중앙)을 명시 선택하고 **14:00–15:00**(짧은 mid-day 블록)로 예약한다.
 * (page.clock은 실서버 시각과 어긋나 거부되므로 못 씀 → 미래 날짜를 UI로 직접 고른다.)
 */
const ROOM = '/reservations/seminar-room/301-417';

/** 다음 달 15일 14:00–15:00로 예약(결정론적). 잡은 예약 날짜를 반환한다. */
async function reserve(page: Page, title: string, recurringWeeks = 1) {
  // 다음 달 15일(로컬). 캘린더는 selected(오늘)의 달로 열리므로 "다음 달" nav 1회 후 15일.
  const t = new Date();
  t.setMonth(t.getMonth() + 1, 15);
  const y = t.getFullYear();
  const mo = t.getMonth() + 1;
  const date = `${y}-${String(mo).padStart(2, '0')}-15`;

  await page.getByRole('button', { name: '예약하기' }).click();
  const dialog = page.getByRole('dialog');
  const dateFs = dialog.locator('fieldset').filter({ hasText: '예약 날짜' });

  // 날짜: 피커 열기 → 다음 달 → 15일(접근명은 전체날짜라 본문 텍스트 '15'로 선택).
  await dateFs.getByRole('button').first().click();
  await dialog.getByRole('button', { name: '다음 달로 이동' }).click();
  await dateFs.getByText('15', { exact: true }).click();

  if (recurringWeeks > 1) {
    const recurFs = dialog.locator('fieldset').filter({ hasText: '매주 반복' });
    await recurFs.getByRole('button').first().click();
    await recurFs
      .getByRole('button', { name: String(recurringWeeks), exact: true })
      .click();
  }

  // 시작 14:00 / 종료 15:00 (미래 날짜라 과거시간 필터 없음 → 항상 선택 가능).
  const startFs = dialog.locator('fieldset').filter({ hasText: '시작 시간' });
  await startFs.getByRole('button').first().click();
  await startFs.getByRole('button', { name: '14:00', exact: true }).click();
  const endFs = dialog.locator('fieldset').filter({ hasText: '종료 시간' });
  await endFs.getByRole('button').first().click();
  await endFs.getByRole('button', { name: '15:00', exact: true }).click();

  await fillTextInput(page, 'title', title);
  await fillTextInput(page, 'contactEmail', 'auto@snu.ac.kr');
  await fillTextInput(page, 'contactPhone', '02-880-0000');
  await fillTextInput(page, 'professor', '김교수');
  await fillTextArea(page, 'purpose', '세미나 진행');
  await dialog.getByText('개인정보 수집 및 이용동의').click();

  const submit = dialog.getByRole('button', { name: '예약하기' });
  await expect(submit).toBeEnabled();
  await submit.click();
  // 성공 시 모달이 닫힘(onSuccess). ephemeral 토스트 대신 모달 닫힘으로 완료를 대기한다.
  await expect(dialog).toBeHidden({ timeout: 15_000 });

  return { y, mo, d: 15, date };
}

test.describe('시설 예약 - 예약 플로우', () => {
  test('staff가 세미나실을 예약→취소한다', async ({ page }) => {
    const title = `자동화예약${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto(ROOM);
    await loginAsStaff(page);

    const booked = await reserve(page, title);

    // 예약 날짜의 주로 이동 → 생성된 예약 노출
    await page.goto(`${ROOM}?selectedDate=${booked.date}`);
    await expect(page.getByText(title).first()).toBeVisible();

    // === 취소 === (예약 블록 → 상세 모달 → 해당 예약만 삭제 → 확인 '삭제')
    await page.getByText(title).first().click();
    await deleteItem(
      page,
      '삭제',
      page.getByRole('button', { name: '해당 예약만 삭제' }),
    );
    await expect(page.getByText('예약을 삭제했습니다.')).toBeVisible();
    await expect(page.getByText(title)).toHaveCount(0);
  });

  test('staff가 반복 예약(2회)을 만들고 전체 삭제하면 모든 주에서 사라진다', async ({
    page,
  }) => {
    const title = `반복예약${Date.now()}`;

    await setLocale(page, 'ko');
    await page.goto(ROOM);
    await loginAsStaff(page);

    const booked = await reserve(page, title, 2);
    // 다음 주 날짜(TZ-safe: UTC 파트로 계산)
    const next = new Date(
      Date.UTC(booked.y, booked.mo - 1, booked.d) + 7 * 86_400_000,
    );
    const week2 = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}-${String(next.getUTCDate()).padStart(2, '0')}`;

    // 반복 2회 → 1주차·2주차 모두 노출
    await page.goto(`${ROOM}?selectedDate=${booked.date}`);
    await expect(page.getByText(title).first()).toBeVisible();
    await page.goto(`${ROOM}?selectedDate=${week2}`);
    await expect(page.getByText(title).first()).toBeVisible();

    // 상세 모달: '매주 반복 2회' 노출 → 반복 예약 전체 삭제
    await page.getByText(title).first().click();
    const detail = page.getByRole('dialog');
    await expect(detail.getByText('2회', { exact: true })).toBeVisible();
    await deleteItem(
      page,
      '삭제',
      detail.getByRole('button', { name: '반복 예약 전체 삭제' }),
    );
    await expect(page.getByText('예약을 삭제했습니다.')).toBeVisible();

    // 전체 삭제 → 양 주차 모두 사라짐
    await expect(page.getByText(title)).toHaveCount(0);
    await page.goto(`${ROOM}?selectedDate=${booked.date}`);
    await expect(page.getByText(title)).toHaveCount(0);
  });
});
