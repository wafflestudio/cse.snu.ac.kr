import { createFileRoute } from '@tanstack/react-router';
import CategoryPage from '~/components/feature/category/CategoryPage';

function PeoplePage() {
  return <CategoryPage subtitle="People of CSE" />;
}

export const Route = createFileRoute('/{-$locale}/people/')({
  component: PeoplePage,
});
