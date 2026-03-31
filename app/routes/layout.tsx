import type { Route } from '.react-router/types/app/routes/+types/layout';
import { useEffect } from 'react';
import { isRouteErrorResponse, Outlet, useNavigate } from 'react-router';
import Header from '~/components/layout/Header';
import ErrorState from '~/components/ui/ErrorState';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { type Role, useStore } from '~/store';

export async function loader({ request }: Route.LoaderArgs): Promise<Role[]> {
  try {
    const response = await fetch(`${BASE_URL}/v2/user/my-role`, {
      headers: request.headers,
    });
    if (!response.ok) return [];

    const { roles }: { roles: string[] } = await response.json();
    return roles.filter((r) => r !== 'ROLE_ANONYMOUS') as Role[];
  } catch {
    return [];
  }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  useEffect(() => {
    useStore.setState({ roles: loaderData });
  }, [loaderData]);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useLanguage({ '메인으로 이동': 'Go to home' });
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error';

  return (
    <>
      <Header />
      <ErrorState
        title="500"
        message={`Error: ${message}`}
        action={{ label: t('메인으로 이동'), onClick: () => navigate('/') }}
      />
    </>
  );
}
