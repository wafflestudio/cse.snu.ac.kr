import { createFileRoute } from '@tanstack/react-router';

import LoginVisible from '@/components/feature/auth/LoginVisible';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import HTMLViewer from '@/components/ui/HTMLViewer';
import { BASE_URL } from '@/constants/api';
import { processHtmlForCsp } from '@/utils/cspServerFn';

function InternalPage() {
  const loaderData = Route.useLoaderData();

  return (
    <PageLayout title="학부 메일링리스트" titleSize="xl">
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 text-right">
          <Button as="link" to="/.internal/edit" kind="secondary" size="md">
            편집
          </Button>
        </div>
      </LoginVisible>
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}

export const Route = createFileRoute('/.internal/')({
  loader: async () => {
    const response = await fetch(`${BASE_URL}/v2/internal`);
    if (!response.ok) throw new Error('Failed to fetch internal');
    const data = (await response.json()) as { description: string };
    return { description: await processHtmlForCsp(data.description) };
  },
  component: InternalPage,
});
