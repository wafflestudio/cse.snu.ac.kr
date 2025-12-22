import { useLanguage } from '~/hooks/useLanguage';
import MagnificentGlass from '../assets/magnificent_glass.svg?react';
import { SEARCH_TRANSLATIONS } from '../constants';

export default function NoSearchResult() {
  const { t } = useLanguage(SEARCH_TRANSLATIONS);
  return (
    <div className="flex flex-col items-center">
      <p className="text-base font-medium text-neutral-300">
        {t('검색 결과가 존재하지 않습니다')}
      </p>
      <MagnificentGlass />
    </div>
  );
}
