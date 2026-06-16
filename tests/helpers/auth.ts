import { expect, type Page } from '@playwright/test';

const BACKEND_URL = process.env.E2E_BACKEND_URL ?? 'http://localhost:8080';

/**
 * STAFF(또는 지정 역할)로 로그인합니다.
 *
 * 프로덕션 빌드에는 dev용 STAFF 버튼이 없으므로(진짜 OAuth 로그인 버튼만 존재),
 * mock-login(@Profile("!prod"))으로 세션 쿠키(JSESSIONID)를 발급받습니다. 컨텍스트
 * request는 페이지와 쿠키 저장소를 공유하므로, reload하면 레이아웃 loader의 my-role이
 * 세션을 읽어 staff UI(로그아웃·관리 버튼)를 렌더합니다. → 프로덕션과 동일한 화면.
 *
 * 전제: 이미 앱 페이지에 진입한 상태에서 호출(reload로 세션 반영).
 */
export async function loginAsStaff(page: Page, ...roles: string[]) {
  const selected = roles.length > 0 ? roles : ['ROLE_STAFF'];
  const params = selected.map((r) => `role=${r}`).join('&');

  await page
    .context()
    .request.get(`${BACKEND_URL}/api/v2/mock-login?${params}`);

  await page.reload();
  await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible();
}
