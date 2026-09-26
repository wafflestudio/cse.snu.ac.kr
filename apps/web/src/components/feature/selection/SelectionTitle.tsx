import { Link as LinkIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import Node from '@/components/ui/Nodes';

// 선택 탭 아래 고른 항목의 제목 한 부품(/design-system#page): 20/700 + 아래 주황 직선(1-7).
// 부제·외부 링크·오른쪽 관리 버튼은 선택.
interface SelectionTitleProps {
  title: string;
  subtitle?: string;
  href?: string;
  actions?: ReactNode;
  animateKey?: string;
}

export default function SelectionTitle({
  title,
  subtitle,
  href,
  actions,
  animateKey,
}: SelectionTitleProps) {
  return (
    <div
      className="mb-4 flex flex-wrap items-start justify-between gap-3"
      key={animateKey ?? title}
    >
      <div className="sm:w-fit">
        <h2 className="px-3 type-section text-neutral-950">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1"
            >
              <span>{title}</span>
              <LinkIcon className="text-neutral-500 group-hover:text-main-orange" />
            </a>
          ) : (
            <span className="flex items-baseline gap-2">
              <span>{title}</span>
              {subtitle && <span className="type-meta">{subtitle}</span>}
            </span>
          )}
        </h2>
        <div className="animate-stretch">
          <Node variant="straight" />
        </div>
      </div>
      {/* 자리가 모자라면 다음 줄 오른쪽으로 내려간다(버튼 줄 규칙). */}
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
}
