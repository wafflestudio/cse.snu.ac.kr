import { BASE_URL } from '@/constants/api';
import type { Role } from '@/store';
import { forwardAuthHeaders } from '@/utils/ssr';

/**
 * 세션의 역할 목록. `ROLE_ANONYMOUS`를 걸러내므로 **빈 배열 = 비로그인**이다.
 * 실패하면 빈 배열(백엔드 장애로 화면 전체가 죽지 않게).
 *
 * ⚠️ 인증이 필요한 다른 엔드포인트는 비로그인에 401/403이 아니라 **302 OAuth 리다이렉트**를
 * 준다. 앱은 그 최종 URL(identity provider)에 도달할 수 없어 loader가 네트워크 에러로 죽는다
 * → 로그인 여부 판정에 그런 엔드포인트를 쓰면 안 된다. `my-role`은 비로그인에도 200을
 * 돌려주는 유일한 경로라서 판정 기준으로 쓴다.
 */
export async function fetchSessionRoles(): Promise<Role[]> {
  try {
    const response = await fetch(`${BASE_URL}/v2/user/my-role`, {
      headers: forwardAuthHeaders(),
    });
    if (!response.ok) return [];
    const { roles }: { roles: string[] } = await response.json();
    return roles.filter((r) => r !== 'ROLE_ANONYMOUS') as Role[];
  } catch {
    return [];
  }
}
