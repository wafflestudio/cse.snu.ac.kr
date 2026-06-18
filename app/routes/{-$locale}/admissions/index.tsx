import { createFileRoute } from '@tanstack/react-router';
import CategoryPage from '@/components/feature/category/CategoryPage';

function AdmissionsPage() {
  return <CategoryPage subtitle="Join CSE" />;
}

export const Route = createFileRoute('/{-$locale}/admissions/')({
  component: AdmissionsPage,
});
