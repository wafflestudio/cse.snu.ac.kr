import { createFileRoute } from '@tanstack/react-router';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import HTMLViewer from '@/components/ui/HTMLViewer';
import { api } from '@/utils/api';
import { processHtmlForCsp } from '@/utils/processHtmlForCsp';

function InternalPage() {
  const loaderData = Route.useLoaderData();

  return (
    <PageLayout title="학부 메일링리스트" titleSize="xl">
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 text-right">
          <Button as="link" to="/.internal/edit" variant="secondary" size="md">
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
    const data = await api.get('v2/internal').json<{ description: string }>();
    return { description: await processHtmlForCsp({ data: data.description }) };
  },
  component: InternalPage,
});
