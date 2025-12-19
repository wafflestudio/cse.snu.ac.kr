import { type NavItem, navigationTree } from '~/constants/navigation';
import { isAncestorNavItem, useActiveNavItem } from './useActiveNavItem';

export function useTopLevelNavItem(): NavItem | null {
  const activeItem = useActiveNavItem();

  if (!activeItem) return null;

  // navigationTree의 직접 자식 중에서 activeItem의 조상 찾기
  for (const topLevel of navigationTree) {
    if (topLevel.key === activeItem.key) return topLevel;
    if (isAncestorNavItem(topLevel, activeItem)) return topLevel;
  }

  return null;
}
