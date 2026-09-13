import { createFileRoute } from '@tanstack/react-router';
import { handleSitemapIndex } from '@/sitemap';

// /sitemap.xml — 사이트맵 인덱스([.]는 리터럴 점 이스케이프). 실제 URL 은 /sitemap/<유형>.xml.
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: ({ request }) => handleSitemapIndex(request),
    },
  },
});
