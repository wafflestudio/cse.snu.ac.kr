import { createFileRoute } from '@tanstack/react-router';
import CategoryPage from '@/components/feature/category/CategoryPage';

function TenTenProjectPage() {
  return <CategoryPage />;
}

export const Route = createFileRoute('/{-$locale}/10-10-project/')({
  component: TenTenProjectPage,
});
