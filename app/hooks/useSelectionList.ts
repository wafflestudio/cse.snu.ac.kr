import { useSearchParams } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';
import { decodeParam, encodeParam } from '~/utils/string';

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
