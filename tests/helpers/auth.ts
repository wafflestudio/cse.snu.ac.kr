import { expect, type Page } from '@playwright/test';

/**
 * STAFF(또는 지정 역할)로 로그인합니다.
 *
 * 프로덕션 빌드에는 dev용 STAFF 버튼이 없으므로(진짜 OAuth 로그인 버튼만 존재),
 * mock-login(@Profile("!prod"))으로 세션 쿠키(JSESSIONID)를 발급받습니다. reload하면
 * 레이아웃 loader의 my-role이 세션을 읽어 staff UI(로그아웃·관리 버튼)를 렌더합니다.
 *
 * ⚠️ mock-login은 **앱과 same-origin**(baseURL=:3000 의 `/api` 프록시 경유)으로 호출해야
 * JSESSIONID 쿠키가 앱 origin(localhost)으로 스코프돼 reload 때 실린다. 백엔드를 직접
 * (컨테이너에선 host.docker.internal:8080) 호출하면 쿠키 도메인이 달라 세션이 안 잡힌다.
 *
 * 전제: 이미 앱 페이지에 진입한 상태에서 호출(reload로 세션 반영).
 */
export async function loginAsStaff(page: Page, ...roles: string[]) {
  const selected = roles.length > 0 ? roles : ['ROLE_STAFF'];
  const params = selected.map((r) => `role=${r}`).join('&');

  await page.request.get(`/api/v2/mock-login?${params}`);

  await page.reload();
  await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible();
}
