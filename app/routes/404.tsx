import { useLocation, useNavigate } from 'react-router';
import Header from '~/components/layout/Header';
import { Button } from '~/components/ui/button';
import { useLanguage } from '~/hooks/useLanguage';

export default function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage({
    '존재하지 않는 경로입니다': 'Page not found',
    '메인으로 이동': 'Go to home',
  });

  return (
    <>
      <Header />
      <div className="grow p-15 flex flex-col items-start gap-4">
        <p className="text-lg text-white">
          {t('존재하지 않는 경로입니다')}: {pathname}
        </p>
        <Button variant="gray" onClick={() => navigate('/')}>
          {t('메인으로 이동')}
        </Button>
      </div>
    </>
  );
}
