import { type NavItem, navigationTree } from '~/constants/navigation';
import { useLanguage } from '~/hooks/useLanguage';

export function useNavItem() {
  const { pathWithoutLocale } = useLanguage();

  const activeItem = findNavItemByPath(navigationTree, pathWithoutLocale);
  const topLevelItem = activeItem ? findTopLevelItem(activeItem) : null;

  return { activeItem, topLevelItem };
}

function findNavItemByPath(
  items: NavItem[],
  targetPath: string,
): NavItem | null {
  for (const item of items) {
    // path가 있는 항목만 비교
    if (item.path && item.path === targetPath) return item;

    if (item.children) {
      const found = findNavItemByPath(item.children, targetPath);
      if (found) return found;
    }
  }

  return null;
}

function findTopLevelItem(activeItem: NavItem): NavItem | null {
  // navigationTree의 직접 자식 중에서 activeItem의 조상 찾기
  for (const topLevel of navigationTree) {
    if (topLevel.key === activeItem.key) return topLevel;
    if (isAncestorNavItem(topLevel, activeItem)) return topLevel;
  }

  return null;
}

// 전체 트리에서 parent를 찾는 함수
function findParent(tree: NavItem[], childKey: string): NavItem | null {
  for (const item of tree) {
    if (item.children) {
      // 직접 자식인지 확인
      for (const child of item.children) {
        if (child.key === childKey) {
          return item;
        }
      }

      // 재귀적으로 하위 트리 탐색
      const found = findParent(item.children, childKey);
      if (found) return found;
    }
  }
  return null;
}

// Helper: Check if parentItem is an ancestor of childItem
export function isAncestorNavItem(
  parentItem: NavItem,
  childItem: NavItem | null,
): boolean {
  if (!childItem) return false;
  if (childItem.key === parentItem.key) return true;

  // 전체 트리를 순회하면서 조상인지 확인
  let current: NavItem | null = childItem;
  while (current) {
    const parent = findParent(navigationTree, current.key);
    if (!parent) break;
    if (parent.key === parentItem.key) return true;
    current = parent;
  }

  return false;
}
