import { createFileRoute } from '@tanstack/react-router';
import CategoryPage from '@/components/feature/category/CategoryPage';

function CommunityPage() {
  return <CategoryPage subtitle="Connect with CSE" />;
}

export const Route = createFileRoute('/{-$locale}/community/')({
  component: CommunityPage,
});
