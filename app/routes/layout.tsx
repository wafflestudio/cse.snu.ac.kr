import type { Route } from '.react-router/types/app/routes/+types/layout';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { BASE_URL } from '~/constants/api';
import { type Role, useStore } from '~/store';

export async function loader({
  request,
}: Route.LoaderArgs): Promise<Role | undefined> {
  try {
    const response = await fetch(`${BASE_URL}/v2/user/my-role`, {
      headers: request.headers,
    });
    if (!response.ok) return undefined;

    const { roles }: { roles: Role[] } = await response.json();

    // 우선순위 체크
    if (roles.includes('ROLE_STAFF')) return 'ROLE_STAFF';
    if (roles.includes('ROLE_RESERVATION')) return 'ROLE_RESERVATION';
    if (roles.includes('ROLE_COUNCIL')) return 'ROLE_COUNCIL';

    return undefined;
  } catch {
    return undefined;
  }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  useEffect(() => {
    useStore.setState({ role: loaderData });
  }, [loaderData]);

  return <Outlet />;
}
