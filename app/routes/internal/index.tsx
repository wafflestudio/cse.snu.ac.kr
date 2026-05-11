import type { Route } from '.react-router/types/app/routes/internal/+types/index';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { BASE_URL } from '~/constants/api';
import { processHtmlForCsp } from '~/utils/csp';

export const loader = async () => {
  const response = await fetch(`${BASE_URL}/v2/internal`);
  if (!response.ok) throw new Error('Failed to fetch internal');
  const data = (await response.json()) as { description: string };
  return { description: processHtmlForCsp(data.description) };
};

export default function InternalPage({ loaderData }: Route.ComponentProps) {
  return (
    <PageLayout title="학부 메일링리스트" titleSize="xl">
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 text-right">
          <Button
            as="link"
            to="/.internal/edit"
            variant="outline"
            tone="neutral"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
