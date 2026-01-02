import { useSearchParams } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';

// 훅 내부에서만 사용하는 인코딩/디코딩 함수
const encodeParam = (words: string) => words.replace(/\s+/g, '-');
const decodeParam = (words: string) => words.replace(/-/g, ' ');

/**
 * 외부에서 selection list 페이지로 연결하는 URL을 생성합니다.
 * @param basePath - 베이스 경로 (예: '/about/directions', '/research/groups')
 * @param selectedId - 선택할 항목의 ID 또는 이름
 * @returns 쿼리 파라미터가 포함된 경로 (예: '/about/directions?selected=Computer-Science')
 */
export const createSelectionUrl = (basePath: string, selectedId: string) => {
  const encodedId = encodeParam(selectedId);
  return `${basePath}?selected=${encodedId}`;
};

interface UseSelectionListOptions<T> {
  items: T[];
  getItem: (item: T) => { id: string | number; label: string };
}

// SelectionList와 공유하는 타입
export interface SelectionListItem {
  id: string;
  label: string;
  href: string;
  selected?: boolean;
}

interface UseSelectionListReturn<T> {
  selectedItem: T | undefined;
  selectionItems: SelectionListItem[];
}

export function useSelectionList<T>(
  options: UseSelectionListOptions<T>,
): UseSelectionListReturn<T> {
  const { items, getItem } = options;
  const [searchParams] = useSearchParams();
  const { pathWithoutLocale, localizedPath } = useLanguage();

  // ID를 string으로 변환하는 헬퍼
  const getIdString = (item: T): string => {
    const { id } = getItem(item);
    return typeof id === 'number' ? id.toString() : id;
  };

  // 선택된 항목 찾기
  const selectedParam = searchParams.get('selected');
  const defaultItem = items[0];

  let selectedItem: T | undefined;

  if (!selectedParam) {
    selectedItem = defaultItem;
  } else {
    const decodedParam = decodeParam(selectedParam);
    selectedItem =
      items.find((item) => {
        const idString = getIdString(item);
        return decodeParam(idString) === decodedParam;
      }) ?? defaultItem;
  }

  // selectionItems 생성
  const selectionItems = items.map((item) => {
    const { id, label } = getItem(item);
    const idString = typeof id === 'number' ? id.toString() : id;
    const encodedId = encodeParam(idString);
    const href = localizedPath(`${pathWithoutLocale}?selected=${encodedId}`);

    // 선택 여부 확인
    const isSelected =
      selectedItem !== undefined &&
      decodeParam(getIdString(selectedItem)) === decodeParam(idString);

    return {
      id: idString,
      label,
      href,
      selected: isSelected,
    };
  });

  return {
    selectedItem,
    selectionItems,
  };
}
