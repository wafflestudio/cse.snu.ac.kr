import EmptyState from '@/components/ui/EmptyState';
import { useLanguage } from '@/hooks/useLanguage';

export default function NoSearchResult() {
  const { t } = useLanguage();
  return <EmptyState>{t('검색 결과가 존재하지 않습니다')}</EmptyState>;
}
