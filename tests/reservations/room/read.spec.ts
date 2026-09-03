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

  /**
   * 회귀: 날짜 이동은 **클릭(클라 네비게이션)** 으로 검증한다.
   *
   * 다른 read 케이스처럼 `?selectedDate=`로 goto하면 전체 문서 로드라 loader가 항상 SSR에서
   * 돌아, 클라 네비게이션에서 loader가 재실행되지 않는 버그(loaderDeps 누락)를 못 잡는다.
   * 실제로 그렇게 URL만 바뀌고 캘린더는 그대로인 버그가 있었다 → src/utils/loaderDeps.ts.
   */
  test('다음/이전 버튼 클릭 시 날짜가 이동한다 (ko)', async ({
    page,
  }, testInfo) => {
    // 데스크톱은 주(7칸) 단위·주의 시작 기준, 모바일은 3일 단위·선택일 기준으로 움직인다.
    const step = testInfo.project.name.includes('mobile') ? 3 : 7;
    const column = (date: string) => page.locator(`time[datetime="${date}"]`);

    await setLocale(page, 'ko');
    await page.goto(
      '/reservations/seminar-room/301-417?selectedDate=2024-03-15',
    );
    await expect(column('2024-03-15')).toBeVisible();

    const next = step === 7 ? '2024-03-22' : '2024-03-18';
    await page.getByRole('button', { name: '다음 날짜' }).click();
    await page.waitForURL(new RegExp(`selectedDate=${next}`));
    await expect(column(next)).toBeVisible();
    await expect(column('2024-03-15')).toHaveCount(0);

    await page.getByRole('button', { name: '이전 날짜' }).click();
    await page.waitForURL(/selectedDate=2024-03-15/);
    await expect(column('2024-03-15')).toBeVisible();
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
