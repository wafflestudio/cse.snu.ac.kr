import { Link } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

// 예약 폼의 개인정보 동의 내용 링크. 사이트에서 유일하게 새 탭으로 연다. 같은 탭이면 쓰던 예약 내용이
// 사라진다(/design-system/links). 새 탭이라는 것을 아이콘과 화면 읽기 프로그램용 안내로 알린다.
export default function PrivacyPolicyLink() {
  const { t, localizedPath } = useLanguage({
    '동의 내용 보기': 'View terms',
    '(새 탭)': '(opens in new tab)',
  });

  return (
    <Link
      className="flex items-center gap-1 type-ui text-neutral-500 hover:text-main-orange-dark"
      to={localizedPath('/reservations/privacy-policy')}
      target="_blank"
      rel="noopener noreferrer"
    >
      {t('동의 내용 보기')}
      <span className="sr-only">{t('(새 탭)')}</span>
      <ExternalLink />
    </Link>
  );
}
