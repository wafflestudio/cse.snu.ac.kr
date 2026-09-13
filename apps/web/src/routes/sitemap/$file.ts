import { createFileRoute } from '@tanstack/react-router';
import { handleSitemapSection } from '@/sitemap';

// /sitemap/<유형>.xml — 파일명이 파라미터로 들어온다(notice.xml 등). 모르는 이름은 404.
export const Route = createFileRoute('/sitemap/$file')({
  server: {
    handlers: {
      GET: ({ request, params }) => handleSitemapSection(request, params.file),
    },
  },
});
