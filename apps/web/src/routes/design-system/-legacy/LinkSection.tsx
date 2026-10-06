import type { ReactNode } from 'react';

// d1baf83c 의 apps/web/src/routes/$locale/-components/LinkSection.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 메인 아래 바로가기 두 열 중 하나만, 모바일 모양으로(sm: 값은 뺐다). 줄(LinkRow)은 children 으로 받는다.
// 예전 값: 열 제목 14·500 neutral-400(text-md), 제목 아래 22px(gap-[1.37rem]), 줄 사이 20px.

export function LegacyLinkSectionColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-[1.37rem]">
      <h3 className="text-md font-medium text-neutral-400">{title}</h3>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
