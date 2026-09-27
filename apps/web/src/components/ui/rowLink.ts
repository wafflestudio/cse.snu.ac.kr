// 표 행 전체를 누르는 영역으로(/design-system/list). 링크·버튼은 행에 하나만 두고, 그 요소의 ::after 를
// 행 크기로 넓힌다 — 읽기 도구에는 링크 하나로 읽히고 Tab 순서도 그대로다.
// 초점 링은 행에 안쪽으로 그린다(바깥이면 위아래 행에 겹친다).
export const ROW_LINK =
  'group relative has-[.row-link-target:focus-visible]:[outline:2px_solid_var(--focus-ring,var(--color-neutral-700))] has-[.row-link-target:focus-visible]:-outline-offset-2';

export const ROW_LINK_TARGET =
  'row-link-target after:absolute after:inset-0 after:content-[""] focus-visible:outline-none';
