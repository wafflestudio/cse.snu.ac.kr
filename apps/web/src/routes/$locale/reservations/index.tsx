import { createFileRoute } from '@tanstack/react-router';
import CategoryPage from '@/components/feature/category/CategoryPage';

function ReservationsPage() {
  return <CategoryPage subtitle="Reserve CSE Facilities" />;
}

export const Route = createFileRoute('/$locale/reservations/')({
  component: ReservationsPage,
});
