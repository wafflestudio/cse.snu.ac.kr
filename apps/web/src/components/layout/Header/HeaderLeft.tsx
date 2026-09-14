import { Link } from '@tanstack/react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { useStore } from '@/store';
// 큰 정적 로고는 인라인(?react) 대신 <img>(?url)로 — 매 페이지 HTML에 path를 박지 않고
// 같은 오리진 캐시 리소스로 1회 로드(문서 크기 절감). SNU_Logo는 재색칠이 필요해 .snu-logo 마스크로.
import headerLogoUrl from './assets/header_logo.svg?url';
import headerSubTextUrl from './assets/header_sub_text.svg?url';
import headerTextUrl from './assets/header_text.svg?url';

const translations = {
  '메인으로 이동': 'Go to home',
};

export default function HeaderLeft() {
  const { localizedPath, t } = useLanguage(translations);
  const homePath = localizedPath('/');
  const closeNavbar = useStore((s) => s.closeNavbar);

  return (
    <Link
      to={homePath}
      className="cursor-pointer"
      aria-label={t('메인으로 이동')}
      onClick={closeNavbar}
    >
      {/* desktop - 큰 화면에서만 표시 */}
      <img
        src={headerLogoUrl}
        alt=""
        width={256}
        height={56}
        className="hidden sm:block"
      />

      {/* mobile - 작은 화면에서만 표시 */}
      <div className="flex items-center gap-4 sm:hidden">
        <span className="snu-logo block h-[35px] w-[34px] shrink-0 bg-white" />
        <div className="flex flex-col gap-1">
          <img src={headerTextUrl} alt="" width={133} height={12} />
          <img src={headerSubTextUrl} alt="" width={185} height={9} />
        </div>
      </div>
    </Link>
  );
}
