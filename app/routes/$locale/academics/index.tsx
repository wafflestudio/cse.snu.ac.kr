import { createFileRoute } from '@tanstack/react-router';
import CategoryPage from '@/components/feature/category/CategoryPage';

function AcademicsPage() {
  return <CategoryPage subtitle="Study at CSE" />;
}

export const Route = createFileRoute('/$locale/academics/')({
  component: AcademicsPage,
});
