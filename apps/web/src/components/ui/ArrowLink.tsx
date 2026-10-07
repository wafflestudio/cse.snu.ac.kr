import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

// 이동 링크(/design-system/links): 모음 페이지로 보내는 글자 + 화살표(더보기, ○○ 스트림).
// 글자가 이미 주황이라 호버는 색 대신 밑줄로 알린다.
export default function ArrowLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex w-fit items-center gap-1 type-ui text-main-orange-dark underline-offset-4 hover:underline"
    >
      {children} <ArrowRight />
    </Link>
  );
}
