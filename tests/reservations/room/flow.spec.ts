import { type Page, expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import { deleteItem, fillTextArea, fillTextInput } from '../../helpers/forms';
import { setLocale } from '../../helpers/locale';

/**
 * 시설 예약 플로우. STAFF는 예약 권한(hasAnyRole STAFF/RESERVATION/LABMASTER) 보유.
 * 모달 date/시간은 기본값(오늘 가장 이른 가용 슬롯)을 그대로 쓰고 필수 항목만 채운다.
 *
 * 결정론: 기본 슬롯은 시각에 따라 다음 날(=다음 주)로 롤오버될 수 있다(예: 늦은 일요일 밤 →
 * 월요일). 캘린더는 selectedDate의 주(week)만 보여주므로, 검증은 **모달이 잡은 예약 날짜를 읽어
 * 그 날짜의 주로 캘린더를 이동(`?selectedDate=`)** 한 뒤 수행한다 → 시각/요일과 무관하게 노출.
 * (실서버라 page.clock으로 앱 시각만 고정하면 백엔드 시각과 어긋나 거부됨 → 시각 고정 대신 주 이동.)
 */
const ROOM = '/reservations/seminar-room/301-417';

/** 예약 모달을 열어 필수 항목을 채우고 제출. 모달이 잡은 기본 예약 날짜를 반환한다. */
async function reserve(page: Page, title: string, recurringWeeks = 1) {
  await page.getByRole('button', { name: '예약하기' }).click();
  const dialog = page.getByRole('dialog');

  // 기본 예약 날짜 읽기('YYYY.MM.DD.' → 파트). 검증 시 이 날짜의 주로 이동.
  const dateText =
    (await dialog
      .locator('fieldset')
      .filter({ hasText: '예약 날짜' })
      .getByRole('button')
      .textContent()) ?? '';
  const m = dateText.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (!m) throw new Error(`예약 날짜 파싱 실패: "${dateText}"`);

  if (recurringWeeks > 1) {
    const recurFs = dialog.locator('fieldset').filter({ hasText: '매주 반복' });
    await recurFs.getByRole('button').first().click();
    await recurFs
      .getByRole('button', { name: String(recurringWeeks), exact: true })
      .click();
  }

  // 종료 시간을 가장 늦은 옵션으로(기본 endTime==startTime인 0분 예약 회피)
  const endFs = dialog.locator('fieldset').filter({ hasText: '종료 시간' });
  await endFs.getByRole('button').first().click();
  await endFs
    .getByRole('button')
    .filter({ hasText: /\d{1,2}:\d{2}/ })
    .last()
    .click();

  await fillTextInput(page, 'title', title);
  await fillTextInput(page, 'contactEmail', 'auto@snu.ac.kr');
  await fillTextInput(page, 'contactPhone', '02-880-0000');
  await fillTextInput(page, 'professor', '김교수');
  await fillTextArea(page, 'purpose', '세미나 진행');
  await dialog.getByText('개인정보 수집 및 이용동의').click();

  const submit = dialog.getByRole('button', { name: '예약하기' });
  await expect(submit).toBeEnabled();
  await submit.click();
  // 성공 시 모달이 닫힘(onSuccess). ephemeral 토스트 대신 모달 닫힘으로 완료를 대기한다
  // (부하 시 POST가 느려도 견고하도록 타임아웃 넉넉히). 이후 caller가 해당 주로 이동해 검증.
  await expect(dialog).toBeHidden({ timeout: 15_000 });

  return { y: +m[1], mo: +m[2], d: +m[3], date: `${m[1]}-${m[2]}-${m[3]}` };
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
