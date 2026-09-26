import { Fragment, type ReactNode } from 'react';
import Attachments from '@/components/ui/Attachments';
import Node from '@/components/ui/Nodes';
import { Tag } from '@/components/ui/Tag';
import type { Attachment } from '@/types/api';

// 게시물 상세 한 벌(/design-system#post) — 공지·새 소식·세미나.
// 흰 머리 띠(제목·정보 줄) + 옅은 회색 본문 띠(첨부 → 본문 → 주황 선 → 태그 → 이전·다음 글·버튼 줄). 묶음 사이 48.
interface PostDetailProps {
  title: string;
  // 정보 줄: 가운뎃점으로 잇는다. 조회수처럼 E2E 가 가리는 값은 요소 그대로 넘긴다.
  meta: ReactNode[];
  attachments?: Attachment[];
  tags?: { label: string; href: string }[];
  footer: ReactNode;
  children: ReactNode;
}

export default function PostDetail({
  title,
  meta,
  attachments = [],
  tags = [],
  footer,
  children,
}: PostDetailProps) {
  return (
    <>
      <div className="flex flex-col gap-2 page-gutter-x py-8">
        <h2 className="type-section">{title}</h2>
        {meta.length > 0 && (
          <p className="type-meta text-neutral-500">
            {meta.map((item, i) => (
              <Fragment key={i}>
                {i > 0 && ' · '}
                {item}
              </Fragment>
            ))}
          </p>
        )}
      </div>

      <div className="bg-neutral-50 page-gutter-x pt-8 pb-16 sm:pb-32">
        <Attachments files={attachments} />
        {children}
        <div className="mt-12">
          <Node variant="straight" />
        </div>
        {tags.length > 0 && (
          <div className="mt-3 ml-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag.label} label={tag.label} href={tag.href} />
            ))}
          </div>
        )}
        {footer}
      </div>
    </>
  );
}
