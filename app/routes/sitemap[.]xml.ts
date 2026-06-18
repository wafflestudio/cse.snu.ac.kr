import { createFileRoute } from '@tanstack/react-router';
import { handleSitemap } from '@/sitemap';

// /sitemap.xml — TanStack Start server route([.]는 리터럴 점 이스케이프).
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: ({ request }) => handleSitemap(request),
    },
  },
});
