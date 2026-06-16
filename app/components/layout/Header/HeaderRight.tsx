import LoginVisible from '~/components/feature/auth/LoginVisible';
import HeaderSearchBar from '~/components/layout/Header/HeaderSearchBar';
import Button from '~/components/ui/Button';
import { IS_DEV, IS_STAGING } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useStore } from '~/store';

const translations = {
  '관리자 메뉴': 'Admin Menu',
  로그인: 'Log in',
  로그아웃: 'Log out',
};

function Divider() {
  return <div className="h-3 w-[0.03125rem] bg-white" />;
}

export default function HeaderRight() {
  const { isEnglish, changeLanguage, t } = useLanguage(translations);

  return (
    <div className="hidden flex-col items-end justify-between gap-[0.94rem] sm:flex">
      <div className="flex items-center gap-3 text-sm font-normal text-white">
        {/* Admin menu - only for ROLE_STAFF */}
        <LoginVisible allow="ROLE_STAFF">
          <Button kind="nav" size="sm" as="link" to="/admin">
            {t('관리자 메뉴')}
          </Button>
          <Divider />
        </LoginVisible>

        {IS_DEV || IS_STAGING ? <DevLogin /> : <ProdLogin t={t} />}

        <Divider />

        <Button kind="nav" size="sm" onClick={changeLanguage}>
          {isEnglish ? (
            '한국어'
          ) : (
            <span className="tracking-[0.025rem]">ENG</span>
          )}
        </Button>
      </div>

      <HeaderSearchBar />
    </div>
  );
}

function ProdLogin({ t }: { t: (key: '로그인' | '로그아웃') => string }) {
  const roles = useStore((s) => s.roles);
  const login = useStore((s) => s.login);
  const logout = useStore((s) => s.logout);

  return roles.length > 0 ? (
    <Button kind="nav" size="sm" onClick={logout}>
      {t('로그아웃')}
    </Button>
  ) : (
    <Button kind="nav" size="sm" onClick={login}>
      {t('로그인')}
    </Button>
  );
}

function DevLogin() {
  const roles = useStore((s) => s.roles);
  const mockLogin = useStore((s) => s.mockLogin);
  const mockLogout = useStore((s) => s.mockLogout);

  if (roles.length > 0) {
    return (
      <Button kind="nav" size="sm" onClick={mockLogout}>
        로그아웃
      </Button>
    );
  }

  return (
    <>
      <Button kind="nav" size="sm" onClick={() => mockLogin('ROLE_STAFF')}>
        STAFF
      </Button>
      <Divider />
      <Button
        kind="nav"
        size="sm"
        onClick={() => mockLogin('ROLE_RESERVATION')}
      >
        RESERV
      </Button>
      <Divider />
      <Button
        kind="nav"
        size="sm"
        onClick={() => mockLogin('ROLE_LABMASTER', 'ROLE_RESERVATION')}
      >
        LAB+RESERV
      </Button>
      <Divider />
      <Button kind="nav" size="sm" onClick={() => mockLogin('ROLE_COUNCIL')}>
        COUNCIL
      </Button>
    </>
  );
}
