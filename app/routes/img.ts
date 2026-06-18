import { createFileRoute } from '@tanstack/react-router';
import { handleImg } from '@/lib/server/img';

// 이미지 최적화 프록시(/img?url=...&w=...&q=...). TanStack Start server route.
// 빌드에 포함돼 dev(vite)·preview·prod 모두에서 동작한다.
export const Route = createFileRoute('/img')({
  server: {
    handlers: {
      GET: ({ request }) => handleImg(request, import.meta.env.DEV),
    },
  },
});
