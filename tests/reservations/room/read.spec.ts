import { expect, test } from '@playwright/test';
import { setLocale } from '../../helpers/locale';

/**
 * 읽기(비로그인·비변경): 시설 예약 캘린더(:roomType/:roomName).
 * 비스태프 열람 가능한 세미나실(301-417, roomId 1). selectedDate 고정으로 주(week) 결정론화
 * (과거 주라 "현재 시각" 라인 없음). 빈 DB라 주간 예약/정기예약 기간 모두 비어 있음.
 */
test.describe('시설 예약 캘린더 - 읽기', () => {
  test('세미나실 캘린더 (ko)', async ({ page }) => {
    await setLocale(page, 'ko');
    const res = await page.goto(
      '/reservations/seminar-room/301-417?selectedDate=2024-03-15',
    );
    expect(res?.status()).toBe(200);
    await expect(page.getByText('301-417').first()).toBeVisible();
    await expect(page).toHaveScreenshot('reservation-room-ko.png', {
      fullPage: true,
    });
  });

  // staff-only 방(302-208/209, id 15·16)은 비-staff에게 캘린더 대신 fallback을 렌더한다
  // (`isStaffOnlyRoom ? <LoginVisible allow=ROLE_STAFF fallback={NonStaffFallback}>`).
  // 비로그인 사용자 기준 = 프론트 조건부 렌더(인가 강제는 백엔드 몫, 여기선 렌더만 검증).
  test('staff 전용 방은 비로그인에게 fallback을 보여준다 (ko)', async ({
    page,
  }) => {
    await setLocale(page, 'ko');
    const res = await page.goto('/reservations/lecture-room/302-208');
    expect(res?.status()).toBe(200);
    await expect(page.getByText('관리자만 열람 가능합니다.')).toBeVisible();
    await expect(page).toHaveScreenshot('reservation-staff-only-ko.png', {
      fullPage: true,
    });
  });
});
